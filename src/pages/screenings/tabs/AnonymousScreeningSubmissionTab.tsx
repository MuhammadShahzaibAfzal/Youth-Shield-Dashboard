/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAnonymousScreeningSubmissions } from "@/http/screening";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Mail, MapPin, School, User } from "lucide-react";
import { useState } from "react";

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  email?: string;
  gender: string;
  age: number;
  countryCode: string;
  countryName: string;
  schoolName?: string;
  isAmbassador: boolean;
}

export interface IScreeningAnswer {
  _id: string;
  question: string;
  answer: string;
  score: number;
}

export interface IAnonymousScreeningSubmission {
  _id: string;
  screening: string;
  totalScore: number;
  personalInfo: IPersonalInfo;
  screeningAnswers: IScreeningAnswer[];
  submittedAt: Date;
}

const AnonymousScreeningSubmissionTab = ({ screeningID }: { screeningID: string }) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedSubmission, setSelectedSubmission] =
    useState<IAnonymousScreeningSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery<{
    submissions: IAnonymousScreeningSubmission[];
    currentPage: number;
    totalPages: number;
    limit: number;
    total: number;
  }>({
    queryKey: ["anonymous-screening-submissions", screeningID, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        screeningId: screeningID,
        page: page.toString(),
        limit: limit.toString(),
      });
      return getAnonymousScreeningSubmissions(params.toString());
    },
    placeholderData: keepPreviousData,
  });

  const handleViewDetails = (submission: IAnonymousScreeningSubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8  bg-gray-200   w-1/3" />
          <Skeleton className="h-4 bg-gray-200   w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10  bg-gray-200  w-full" />
            <Skeleton className="h-64 bg-gray-200   w-full" />
            <Skeleton className="h-10 bg-gray-200   w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            Error loading submissions. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Anonymous Submissions</CardTitle>
          <CardDescription>
            No anonymous submissions found for this screening.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { submissions, currentPage, totalPages, total } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Anonymous Submissions</CardTitle>
          <CardDescription>
            {total} anonymous submission{total !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Ambassador</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {submission.personalInfo.firstName}{" "}
                            {submission.personalInfo.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {submission.personalInfo.age} years old
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {submission.personalInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{submission.personalInfo.email}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {submission.personalInfo.countryName}
                        </span>
                      </div>
                      {submission.personalInfo.schoolName && (
                        <div className="flex items-center gap-2 mt-1">
                          <School className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {submission.personalInfo.schoolName}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={submission.totalScore > 50 ? "default" : "secondary"}
                      >
                        {submission.totalScore} points
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.personalInfo.isAmbassador ? "default" : "outline"
                        }
                      >
                        {submission.personalInfo.isAmbassador ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={isDialogOpen && selectedSubmission?._id === submission._id}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Submission Details</DialogTitle>
                            <DialogDescription>
                              Answers from {submission.personalInfo.firstName}{" "}
                              {submission.personalInfo.lastName}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Personal Information</h4>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="font-medium">Name:</span>{" "}
                                    {submission.personalInfo.firstName}{" "}
                                    {submission.personalInfo.lastName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Age:</span>{" "}
                                    {submission.personalInfo.age}
                                  </div>
                                  <div>
                                    <span className="font-medium">Gender:</span>{" "}
                                    {submission.personalInfo.gender}
                                  </div>
                                  <div>
                                    <span className="font-medium">Country:</span>{" "}
                                    {submission.personalInfo.countryName}
                                  </div>
                                  {submission.personalInfo.schoolName && (
                                    <div>
                                      <span className="font-medium">School:</span>{" "}
                                      {submission.personalInfo.schoolName}
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-medium">
                                      Ambassador Interest:
                                    </span>{" "}
                                    <Badge
                                      variant={
                                        submission.personalInfo.isAmbassador
                                          ? "default"
                                          : "outline"
                                      }
                                    >
                                      {submission.personalInfo.isAmbassador
                                        ? "Yes"
                                        : "No"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Screening Summary</h4>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="font-medium">Total Score:</span>{" "}
                                    {submission.totalScore}
                                  </div>
                                  <div>
                                    <span className="font-medium">Submitted:</span>{" "}
                                    {new Date(submission.submittedAt).toLocaleString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Questions Answered:
                                    </span>{" "}
                                    {submission.screeningAnswers.length}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3">Screening Answers</h4>
                              <div className="space-y-4">
                                {submission.screeningAnswers.map((answer, index) => (
                                  <div key={answer._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="font-medium">
                                        Q{index + 1}: {answer.question}
                                      </div>
                                      <Badge variant="outline">
                                        Score: {answer.score}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      <span className="font-medium">Answer:</span>{" "}
                                      {answer.answer}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnonymousScreeningSubmissionTab;
