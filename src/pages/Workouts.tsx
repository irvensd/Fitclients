import { useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Filter,
} from "lucide-react";
import { WorkoutPlan, Exercise } from "@/lib/types";
import { useData } from "@/contexts/DataContext";
import { mockExercises, mockWorkoutPlans } from "@/lib/mockData";

const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { clients } = useData();
  const [workoutData, setWorkoutData] = useState({
    clientId: "",
    name: "",
    description: "",
    exercises: [] as Exercise[],
  });
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    notes: "",
  });

  const handleAddExercise = () => {
    if (!currentExercise.name) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: currentExercise.name,
      sets: parseInt(currentExercise.sets) || 0,
      reps: currentExercise.reps,
      weight: currentExercise.weight,
      duration: currentExercise.duration,
      notes: currentExercise.notes,
    };

    setWorkoutData({
      ...workoutData,
      exercises: [...workoutData.exercises, newExercise],
    });

    setCurrentExercise({
      name: "",
      sets: "",
      reps: "",
      weight: "",
      duration: "",
      notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In offline mode, just log the workout plan
      console.log("Created workout plan:", workoutData);
      alert(`Workout plan "${workoutData.name}" created successfully!`);

      // Reset form and close dialog
      setWorkoutData({
        clientId: "",
        name: "",
        description: "",
        exercises: [],
      });
      setOpen(false);
    } catch (error) {
      console.error("Error creating workout:", error);
      alert("Failed to create workout plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workout Plan</DialogTitle>
          <DialogDescription>
            Design a custom workout plan for your client
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={workoutData.clientId}
                  onValueChange={(value) =>
                    setWorkoutData({ ...workoutData, clientId: value })
                  }
                >
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
              <div className="space-y-2">
                <Label htmlFor="name">Workout Name</Label>
                <Input
                  id="name"
                  value={workoutData.name}
                  onChange={(e) =>
                    setWorkoutData({ ...workoutData, name: e.target.value })
                  }
                  placeholder="e.g., Upper Body Strength"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={workoutData.description}
                onChange={(e) =>
                  setWorkoutData({
                    ...workoutData,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of the workout plan..."
                className="min-h-[80px]"
              />
            </div>

            {/* Exercise Builder */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Add Exercises</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise</Label>
                  <Select
                    value={currentExercise.name}
                    onValueChange={(value) =>
                      setCurrentExercise({ ...currentExercise, name: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseLibrary.map((exercise) => (
                        <SelectItem key={exercise.id} value={exercise.name}>
                          {exercise.name} ({exercise.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    value={currentExercise.sets}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        sets: e.target.value,
                      })
                    }
                    placeholder="3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    value={currentExercise.reps}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        reps: e.target.value,
                      })
                    }
                    placeholder="10-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={currentExercise.weight}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        weight: e.target.value,
                      })
                    }
                    placeholder="50 lbs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={currentExercise.duration}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        duration: e.target.value,
                      })
                    }
                    placeholder="30 sec"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exercise-notes">Exercise Notes</Label>
                <Input
                  id="exercise-notes"
                  value={currentExercise.notes}
                  onChange={(e) =>
                    setCurrentExercise({
                      ...currentExercise,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Focus on form, rest 60 seconds between sets..."
                />
              </div>
              <Button
                type="button"
                onClick={handleAddExercise}
                variant="outline"
              >
                Add Exercise
              </Button>
            </div>

            {/* Exercise List */}
            {workoutData.exercises.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <h4 className="font-medium">
                  Exercises ({workoutData.exercises.length})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {workoutData.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <div className="text-sm">
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-muted-foreground ml-2">
                          {exercise.sets} sets × {exercise.reps}
                          {exercise.weight && ` @ ${exercise.weight}`}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setWorkoutData({
                            ...workoutData,
                            exercises: workoutData.exercises.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Workout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Workouts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading } = useData();

  // Since we don't have workout plans in the data structure yet,
  // we'll show an empty state and let users create workout plans
  const workoutPlans: WorkoutPlan[] = [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workout Plans</h1>
          <p className="text-muted-foreground">
            Create and manage custom workout plans for your clients.
          </p>
        </div>
        <CreateWorkoutDialog />
      </div>

      {/* Empty State */}
      {workoutPlans.length === 0 && (
        <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <Dumbbell className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Workout Plans Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start creating custom workout plans for your clients. Design
              targeted routines to help them achieve their fitness goals.
            </p>
            <CreateWorkoutDialog />
          </CardContent>
        </Card>
      )}

      {/* Exercise Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exercise Library
          </CardTitle>
          <CardDescription>
            Browse available exercises to add to your workout plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exerciseLibrary.map((exercise) => (
              <Card key={exercise.id} className="border-muted">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <Badge variant="secondary">{exercise.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exercise.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{workoutPlans.length}</div>
            <p className="text-sm text-muted-foreground">Total Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-sm text-muted-foreground">Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{exerciseLibrary.length}</div>
            <p className="text-sm text-muted-foreground">Available Exercises</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Active Plans</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Workouts;
