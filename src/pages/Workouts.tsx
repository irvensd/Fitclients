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

// Dialog for viewing workout plan details
const ViewWorkoutDialog = ({
  workout,
  open,
  onOpenChange,
}: {
  workout: WorkoutPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { getClientName } = useData();

  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            {workout.name}
          </DialogTitle>
          <DialogDescription>
            Workout plan for {getClientName(workout.clientId)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Client</p>
              <p className="text-sm text-muted-foreground">
                {getClientName(workout.clientId)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(workout.createdDate).toLocaleDateString()}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {workout.description}
              </p>
            </div>
          </div>

          {/* Exercises */}
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Exercises ({workout.exercises.length})
            </h4>
            <div className="space-y-3">
              {workout.exercises.map((exercise, index) => (
                <Card key={exercise.id} className="border-muted">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs rounded-full">
                            {index + 1}
                          </span>
                          <h5 className="font-medium">{exercise.name}</h5>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {exercise.sets > 0 && (
                            <div>
                              <span className="text-muted-foreground">
                                Sets:
                              </span>{" "}
                              {exercise.sets}
                            </div>
                          )}
                          {exercise.reps && (
                            <div>
                              <span className="text-muted-foreground">
                                Reps:
                              </span>{" "}
                              {exercise.reps}
                            </div>
                          )}
                          {exercise.weight && (
                            <div>
                              <span className="text-muted-foreground">
                                Weight:
                              </span>{" "}
                              {exercise.weight}
                            </div>
                          )}
                          {exercise.duration && (
                            <div>
                              <span className="text-muted-foreground">
                                Duration:
                              </span>{" "}
                              {exercise.duration}
                            </div>
                          )}
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Notes:</span>{" "}
                            {exercise.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Dialog for editing workout plans
const EditWorkoutDialog = ({
  workout,
  open,
  onOpenChange,
  onSave,
}: {
  workout: WorkoutPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedWorkout: WorkoutPlan) => void;
}) => {
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

  // Initialize form data when workout changes
  useEffect(() => {
    if (workout) {
      setWorkoutData({
        clientId: workout.clientId,
        name: workout.name,
        description: workout.description,
        exercises: [...workout.exercises],
      });
    }
  }, [workout]);

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
    if (!workout) return;

    setLoading(true);

    try {
      const updatedWorkout: WorkoutPlan = {
        ...workout,
        clientId: workoutData.clientId,
        name: workoutData.name,
        description: workoutData.description,
        exercises: workoutData.exercises,
      };

      onSave(updatedWorkout);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("Failed to update workout plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workout Plan</DialogTitle>
          <DialogDescription>
            Update the workout plan details and exercises
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
                    <SelectContent className="max-h-60">
                      {mockExercises.map((exercise) => (
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dialog for starting a workout session
const StartSessionDialog = ({
  workout,
  open,
  onOpenChange,
}: {
  workout: WorkoutPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { getClientName } = useData();
  const [loading, setLoading] = useState(false);

  const handleStartSession = async () => {
    if (!workout) return;

    setLoading(true);
    try {
      // Here you would typically create a new session record
      console.log("Starting session for workout:", workout.name);
      alert(
        `Started workout session: ${workout.name} for ${getClientName(workout.clientId)}`,
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Start Workout Session
          </DialogTitle>
          <DialogDescription>
            Are you ready to begin this workout session?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">{workout.name}</h4>
            <p className="text-sm text-muted-foreground">
              Client: {getClientName(workout.clientId)}
            </p>
            <p className="text-sm text-muted-foreground">
              {workout.exercises.length} exercises planned
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>This will:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Create a new training session record</li>
              <li>Start the workout timer</li>
              <li>Allow you to track exercise completion</li>
              <li>Enable session notes and recap</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartSession} disabled={loading}>
            {loading ? "Starting..." : "Start Session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
                    <SelectContent className="max-h-60">
                      {mockExercises.map((exercise) => (
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [activeTab, setActiveTab] = useState("plans");
  const { clients, loading, getClientName } = useData();

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [startSessionDialogOpen, setStartSessionDialogOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(
    null,
  );

  // Load workout plans from localStorage or use mock data for demo
  useEffect(() => {
    const storedPlans = localStorage.getItem("workoutPlans");
    if (storedPlans) {
      setWorkoutPlans(JSON.parse(storedPlans));
    } else {
      setWorkoutPlans(mockWorkoutPlans);
    }
  }, []);

  // Action handlers
  const handleViewWorkout = (workout: WorkoutPlan) => {
    setSelectedWorkout(workout);
    setViewDialogOpen(true);
  };

  const handleEditWorkout = (workout: WorkoutPlan) => {
    setSelectedWorkout(workout);
    setEditDialogOpen(true);
  };

  const handleDuplicateWorkout = (workout: WorkoutPlan) => {
    const duplicatedWorkout: WorkoutPlan = {
      ...workout,
      id: Date.now().toString(),
      name: `${workout.name} (Copy)`,
      createdDate: new Date().toISOString().split("T")[0],
    };

    const updatedPlans = [...workoutPlans, duplicatedWorkout];
    setWorkoutPlans(updatedPlans);
    localStorage.setItem("workoutPlans", JSON.stringify(updatedPlans));

    alert(`Workout plan "${duplicatedWorkout.name}" created successfully!`);
  };

  const handleStartSession = (workout: WorkoutPlan) => {
    setSelectedWorkout(workout);
    setStartSessionDialogOpen(true);
  };

  const handleDeleteWorkout = (workout: WorkoutPlan) => {
    if (confirm(`Are you sure you want to delete "${workout.name}"?`)) {
      const updatedPlans = workoutPlans.filter(
        (plan) => plan.id !== workout.id,
      );
      setWorkoutPlans(updatedPlans);
      localStorage.setItem("workoutPlans", JSON.stringify(updatedPlans));

      alert(`Workout plan "${workout.name}" deleted successfully.`);
    }
  };

  const handleSaveWorkout = (updatedWorkout: WorkoutPlan) => {
    const updatedPlans = workoutPlans.map((plan) =>
      plan.id === updatedWorkout.id ? updatedWorkout : plan,
    );
    setWorkoutPlans(updatedPlans);
    localStorage.setItem("workoutPlans", JSON.stringify(updatedPlans));

    alert(`Workout plan "${updatedWorkout.name}" updated successfully!`);
  };

  // Filter exercises by category and search term
  const filteredExercises = mockExercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [
    "All",
    ...Array.from(new Set(mockExercises.map((ex) => ex.category))),
  ];

  const activeWorkoutPlans = workoutPlans.filter((plan) => plan.isActive);

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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Workout Plans</TabsTrigger>
          <TabsTrigger value="library">Exercise Library</TabsTrigger>
        </TabsList>

        {/* Workout Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {workoutPlans.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                  <Dumbbell className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No Workout Plans Yet
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start creating custom workout plans for your clients. Design
                  targeted routines to help them achieve their fitness goals.
                </p>
                <CreateWorkoutDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {getClientName(plan.clientId)}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Start Session
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {plan.exercises.length} exercises
                        </span>
                        <Badge
                          variant={plan.isActive ? "default" : "secondary"}
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(plan.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm font-medium">Exercises:</p>
                      <div className="max-h-20 overflow-y-auto">
                        {plan.exercises.slice(0, 3).map((exercise, index) => (
                          <div
                            key={exercise.id}
                            className="text-xs text-muted-foreground"
                          >
                            • {exercise.name} ({exercise.sets} sets ×{" "}
                            {exercise.reps})
                          </div>
                        ))}
                        {plan.exercises.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{plan.exercises.length - 3} more exercises
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Exercise Library Tab */}
        <TabsContent value="library" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.id}
                className="border-muted hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <Badge variant="secondary">{exercise.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {exercise.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Dumbbell className="h-3 w-3" />
                      {exercise.equipment}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {exercise.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No exercises found
                </h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search or filter criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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
            <div className="text-2xl font-bold">
              {activeWorkoutPlans.length}
            </div>
            <p className="text-sm text-muted-foreground">Active Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mockExercises.length}</div>
            <p className="text-sm text-muted-foreground">Available Exercises</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-sm text-muted-foreground">Clients</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Workouts;
