import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Resources from "../resources/components/Resources";
import ResourcesCategories from "../resources/components/ResourcesCategories";

const IndependentResourcesMangement = () => {
  return (
    <div>
      <Tabs defaultValue="resources" className="w-full my-8">
        <TabsList className="w-full">
          <TabsTrigger value="resources">Independent Research </TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="resources">
          <Resources isIndependentResource={true} />
        </TabsContent>
        <TabsContent value="categories">
          <ResourcesCategories isIndependentResource={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default IndependentResourcesMangement;
