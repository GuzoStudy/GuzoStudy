import { ExternalLink, Search, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/card';
import { Button } from '../components/Ui/button';

export default function ExploreLink() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Explore New Courses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Discover new courses and expand your knowledge across various subjects and skills.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h4 className="font-medium">Programming</h4>
            <p className="text-sm text-muted-foreground">50+ courses</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h4 className="font-medium">Design</h4>
            <p className="text-sm text-muted-foreground">30+ courses</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h4 className="font-medium">Business</h4>
            <p className="text-sm text-muted-foreground">40+ courses</p>
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <ExternalLink className="h-4 w-4 mr-2" />
          Browse All Courses
        </Button>
      </CardContent>
    </Card>
  );
}