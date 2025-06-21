import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { mockExercises } from "@/lib/mockData";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/contexts/AuthContext";

const WorkoutCard = ({ plan, onView, onEdit, onDuplicate, onStart, onDelete, getClientName }) => (
  <Card
    className="hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => onView(plan)}
  >
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          <CardDescription>
            For: {getClientName(plan.clientId) || "Unassigned"}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => onEdit(plan)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(plan)}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStart(plan)}>
              <Play className="mr-2 h-4 w-4" /> Start Session
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(plan)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center text-sm text-muted-foreground">
        <Users className="h-4 w-4 mr-2" />
        <span>{plan.exercises.length} exercises</span>
      </div>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
        {plan.description}
      </p>
    </CardContent>
  </Card>
);

const ExerciseCard = ({ exercise }) => (
  <Card>
    <CardHeader>
      <CardTitle>{exercise.name}</CardTitle>
      <CardDescription>{exercise.category}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{exercise.description}</p>
    </CardContent>
  </Card>
);

// Dialog for viewing workout plan details
const ViewWorkoutDialog = ({
  workout,
  open,
  onOpenChange,
  onStartSession,
}: {
  workout: WorkoutPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartSession: (workout: WorkoutPlan) => void;
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
          <Button onClick={() => onStartSession(workout!)}>
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
  const [workoutData, setWorkoutData] = useState<any>({
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
    setLoading(true);

    try {
      const updatedWorkout = {
        ...workout,
        ...workoutData,
      };
      onSave(updatedWorkout as WorkoutPlan);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating workout:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workout Plan</DialogTitle>
          <DialogDescription>
            Modify the details of this workout plan.
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

// Dialog for starting a session from a workout plan
const StartSessionDialog = ({
  workout,
  open,
  onOpenChange,
}: {
  workout: WorkoutPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { addSession } = useData();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartSession = async () => {
    if (!workout) return;
    setLoading(true);
    try {
      await addSession({
        clientId: workout.clientId,
        date: new Date().toISOString().split("T")[0],
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: "",
        type: "personal-training",
        status: "scheduled",
        notes: `Session started from workout plan: ${workout.name}`,
        cost: 50, // Example cost
      });
      onOpenChange(false);
      navigate("/sessions");
    } catch (error) {
      console.error("Error starting session:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Session from Plan</DialogTitle>
          <DialogDescription>
            This will create a new session based on the workout plan "{workout.name}".
          </DialogDescription>
        </DialogHeader>
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

// Dialog for creating new workout plans
const CreateWorkoutDialog = ({
  isOpen,
  onOpenChange,
  onWorkoutCreated,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutCreated: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { clients, addWorkoutPlan } = useData();
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
    setCurrentExercise({ name: "", sets: "", reps: "", weight: "", duration: "", notes: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addWorkoutPlan({ ...workoutData, isActive: true });
      onWorkoutCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating workout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workout Plan</DialogTitle>
          <DialogDescription>
            Build a new workout plan for a client.
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
              {loading ? "Creating..." : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Workouts = () => {
  const {
    workoutPlans,
    loading,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    getClientName,
    clients,
  } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("plans");
  const [workoutToView, setWorkoutToView] = useState<WorkoutPlan | null>(null);
  const [workoutToEdit, setWorkoutToEdit] = useState<WorkoutPlan | null>(null);
  const [workoutToStart, setWorkoutToStart] = useState<WorkoutPlan | null>(
    null,
  );
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSaveWorkout = (updatedWorkout: WorkoutPlan) => {
    updateWorkoutPlan(updatedWorkout.id, updatedWorkout);
    setWorkoutToEdit(null);
  };

  const handleDuplicateWorkout = (workout: WorkoutPlan) => {
    const { id, createdDate, ...planToCopy } = workout;
    const duplicatedWorkout: Omit<WorkoutPlan, "id" | "createdDate"> = {
      ...planToCopy,
      name: `${workout.name} (Copy)`,
    };
    addWorkoutPlan(duplicatedWorkout);
  };

  const handleDeleteWorkout = (workout: WorkoutPlan) => {
    if (confirm(`Are you sure you want to delete "${workout.name}"?`)) {
      deleteWorkoutPlan(workout.id);
    }
  };

  const handleStartSession = (workout: WorkoutPlan) => {
    setWorkoutToStart(workout);
  };

  const handleCreateWorkout = () => {
    setCreateDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty state for new accounts (excluding demo account)
  if (user?.email !== "trainer@demo.com" && workoutPlans.length === 0 && !loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workouts</h1>
            <p className="text-muted-foreground">
              Create and manage workout plans for your clients.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Welcome Message */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Dumbbell className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Workout Hub!</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  This is where you'll create personalized workout plans for your clients, track their progress, and help them achieve their fitness goals. 
                  Get started by creating your first workout plan below.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Empty State */}
          <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Dumbbell className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Workout Plans Yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Start building your workout library by creating personalized plans for your clients. 
                Track exercises, sets, reps, and progress over time.
              </p>
              <Button onClick={handleCreateWorkout}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Workout Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* The CreateWorkoutDialog needs to be available for the empty state */}
        <CreateWorkoutDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onWorkoutCreated={() => {
            setCreateDialogOpen(false);
            setActiveTab("plans");
          }}
        />
      </div>
    );
  }

  const categories = [
    "All",
    ...Array.from(new Set(mockExercises.map((ex) => ex.category))),
  ];

  const filteredExercises = mockExercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory.toLowerCase() === "all" || exercise.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workouts</h1>
        <Button onClick={handleCreateWorkout}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">My Plans</TabsTrigger>
            <TabsTrigger value="library">Exercise Library</TabsTrigger>
          </TabsList>
          <TabsContent value="plans" className="space-y-6 mt-6">
            {workoutPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workoutPlans.map((plan) => (
                  <WorkoutCard
                    key={plan.id}
                    plan={plan}
                    onView={setWorkoutToView}
                    onEdit={setWorkoutToEdit}
                    onDuplicate={handleDuplicateWorkout}
                    onStart={handleStartSession}
                    onDelete={handleDeleteWorkout}
                    getClientName={getClientName}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No workout plans found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Get started by creating a new workout plan for your clients.
                  </p>
                  <Button onClick={handleCreateWorkout}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workout Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="library" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <div className="w-full max-w-sm">
                <Input
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-8"
                />
              </div>
              <div className="flex gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog Components */}
      <CreateWorkoutDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onWorkoutCreated={() => setCreateDialogOpen(false)}
      />
      <ViewWorkoutDialog
        workout={workoutToView}
        open={!!workoutToView}
        onOpenChange={() => setWorkoutToView(null)}
        onStartSession={(workout) => {
          setWorkoutToView(null);
          handleStartSession(workout);
        }}
      />
      <EditWorkoutDialog
        workout={workoutToEdit}
        open={!!workoutToEdit}
        onOpenChange={() => setWorkoutToEdit(null)}
        onSave={handleSaveWorkout}
      />
      <StartSessionDialog
        workout={workoutToStart}
        open={!!workoutToStart}
        onOpenChange={() => setWorkoutToStart(null)}
      />
    </div>
  );
};

export default Workouts;
