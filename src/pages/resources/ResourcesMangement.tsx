import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import ResourcesCategories from "./components/ResourcesCategories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResourcesMangement = () => {
  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Resources Management</h1>
          <p>Manage your resources.</p>
        </div>
        <Button>
          <FaPlus />
          Add Resource
        </Button>
      </div>
      <Tabs defaultValue="resources" className="w-full my-8">
        <TabsList className="w-full">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="resources">Resources</TabsContent>
        <TabsContent value="categories">
          <ResourcesCategories />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ResourcesMangement;
