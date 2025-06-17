import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Dumbbell,
  Clock,
  Target,
  Users,
  Edit,
  Copy,
  Trash2,
  Play,
  MoreVertical,
} from "lucide-react";
import { WorkoutPlan, Exercise } from "@/lib/types";

// Mock exercise library
const exerciseLibrary = [
  {
    id: "1",
    name: "Push-ups",
    category: "Chest",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "2",
    name: "Squats",
    category: "Legs",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "3",
    name: "Bench Press",
    category: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    id: "4",
    name: "Deadlift",
    category: "Back",
    equipment: "Barbell",
    difficulty: "Advanced",
  },
  {
    id: "5",
    name: "Plank",
    category: "Core",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
];

// Mock workout plans
const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: "1",
    clientId: "1",
    name: "Sarah's Weight Loss Program",
    description: "12-week program focused on fat loss and toning",
    exercises: [
      {
        id: "1",
        name: "Push-ups",
        sets: 3,
        reps: "12-15",
        notes: "Modify on knees if needed",
      },
      {
        id: "2",
        name: "Squats",
        sets: 3,
        reps: "15-20",
        notes: "Focus on proper form",
      },
      {
        id: "3",
        name: "Plank",
        sets: 3,
        reps: "30-60 seconds",
        notes: "Hold steady, don't let hips drop",
      },
    ],
    createdDate: "2024-03-01",
    isActive: true,
  },
  {
    id: "2",
    clientId: "2",
    name: "Mike's Strength Building",
    description: "Beginner strength training program",
    exercises: [
      {
        id: "1",
        name: "Bench Press",
        sets: 4,
        reps: "8-10",
        weight: "135 lbs",
        notes: "Start light, focus on form",
      },
      {
        id: "2",
        name: "Deadlift",
        sets: 3,
        reps: "5-8",
        weight: "185 lbs",
        notes: "Keep back straight",
      },
    ],
    createdDate: "2024-03-05",
    isActive: true,
  },
  {
    id: "3",
    clientId: "3",
    name: "Emily's Marathon Training",
    description: "Endurance and conditioning program",
    exercises: [
      {
        id: "1",
        name: "Running",
        sets: 1,
        reps: "5K",
        duration: "25-30 minutes",
        notes: "Maintain steady pace",
      },
      {
        id: "2",
        name: "Squats",
        sets: 4,
        reps: "20",
        notes: "High rep for endurance",
      },
    ],
    createdDate: "2024-02-28",
    isActive: true,
  },
];

const clients = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Mike Chen" },
  { id: "3", name: "Emily Davis" },
  { id: "4", name: "James Wilson" },
];

const getClientName = (clientId: string) => {
  return clients.find((c) => c.id === clientId)?.name || "Unassigned";
};

const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const addExercise = (exercise: any) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exercise.name,
      sets: 3,
      reps: "10-12",
      notes: "",
    };
    setSelectedExercises([...selectedExercises, newExercise]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workout Plan</DialogTitle>
          <DialogDescription>
            Design a custom workout plan for your client
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input id="plan-name" placeholder="e.g., Upper Body Strength" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Assign to Client</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the goals and focus of this workout plan..."
            />
          </div>

          {/* Exercise Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add Exercises</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exerciseLibrary.map((exercise) => (
                <Card key={exercise.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exercise.category} • {exercise.equipment}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs mt-1"
                        size="sm"
                      >
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addExercise(exercise)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Exercises */}
          {selectedExercises.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Selected Exercises ({selectedExercises.length})
              </h3>
              <div className="space-y-3">
                {selectedExercises.map((exercise, index) => (
                  <Card key={exercise.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <Label className="text-sm font-medium">
                          {exercise.name}
                        </Label>
                      </div>
                      <div>
                        <Label htmlFor={`sets-${index}`} className="text-xs">
                          Sets
                        </Label>
                        <Input
                          id={`sets-${index}`}
                          type="number"
                          defaultValue={exercise.sets}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`reps-${index}`} className="text-xs">
                          Reps
                        </Label>
                        <Input
                          id={`reps-${index}`}
                          defaultValue={exercise.reps}
                          className="h-8"
                          placeholder="10-12"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setSelectedExercises(
                            selectedExercises.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Label htmlFor={`notes-${index}`} className="text-xs">
                        Notes
                      </Label>
                      <Input
                        id={`notes-${index}`}
                        placeholder="Exercise notes..."
                        className="h-8"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create Workout Plan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Workouts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState<string>("all");

  const filteredPlans = mockWorkoutPlans.filter((plan) => {
    const matchesSearch = plan.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClient =
      clientFilter === "all" || plan.clientId === clientFilter;
    return matchesSearch && matchesClient;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workout Plans</h1>
          <p className="text-muted-foreground">
            Create and manage custom workout plans for your clients.
          </p>
        </div>
        <div className="flex gap-2">
          <CreateWorkoutDialog />
          <Button variant="outline">
            <Dumbbell className="h-4 w-4 mr-2" />
            Exercise Library
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mockWorkoutPlans.length}</div>
            <p className="text-sm text-muted-foreground">Total Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockWorkoutPlans.filter((p) => p.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">Active Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{exerciseLibrary.length}</div>
            <p className="text-sm text-muted-foreground">Exercises Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {new Set(mockWorkoutPlans.map((p) => p.clientId)).size}
            </div>
            <p className="text-sm text-muted-foreground">Clients with Plans</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Workout Plans</TabsTrigger>
          <TabsTrigger value="library">Exercise Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search workout plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Workout Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getClientName(plan.clientId)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {getClientName(plan.clientId)}
                    </span>
                    {plan.isActive && (
                      <Badge className="ml-auto" size="sm">
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                      <span>{plan.exercises.length} exercises</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Created{" "}
                        {new Date(plan.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Exercises:</h4>
                    <div className="space-y-1">
                      {plan.exercises.slice(0, 3).map((exercise) => (
                        <div
                          key={exercise.id}
                          className="text-xs bg-muted rounded p-2"
                        >
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-muted-foreground ml-2">
                            {exercise.sets} sets × {exercise.reps}
                          </span>
                        </div>
                      ))}
                      {plan.exercises.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{plan.exercises.length - 3} more exercises
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <CardDescription>
                Browse and manage your exercise database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exerciseLibrary.map((exercise) => (
                  <Card key={exercise.id} className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" size="sm">
                          {exercise.category}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {exercise.equipment}
                        </Badge>
                      </div>
                      <Badge
                        className={`text-xs ${
                          exercise.difficulty === "Beginner"
                            ? "bg-green-100 text-green-800"
                            : exercise.difficulty === "Intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {exercise.difficulty}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout Templates</CardTitle>
              <CardDescription>
                Pre-built workout templates to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Beginner Full Body</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Perfect for clients just starting their fitness journey
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" size="sm">
                      3 days/week
                    </Badge>
                    <Badge variant="outline" size="sm">
                      45 min
                    </Badge>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Use Template
                  </Button>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Strength Building</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Focus on building muscle mass and strength
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" size="sm">
                      4 days/week
                    </Badge>
                    <Badge variant="outline" size="sm">
                      60 min
                    </Badge>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Use Template
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workouts;
