import Resources from "./components/Resources";
import ResourcesCategories from "./components/ResourcesCategories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResourcesMangement = () => {
  return (
    <div>
      <Tabs defaultValue="resources" className="w-full my-8">
        <TabsList className="w-full">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="resources">
          <Resources />
        </TabsContent>
        <TabsContent value="categories">
          <ResourcesCategories />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ResourcesMangement;
