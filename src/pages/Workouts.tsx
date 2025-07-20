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
  TrendingUp,
  Sparkles,
  Eye,
  X,
  Calendar,
  Activity,
  Timer,
  Repeat,
  BarChart3,
  PieChart,
  LineChart,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Star,
  Award,
  Trophy,
  Medal,
  Crown,
  Flame,
  Heart,
  Shield,
  Target as TargetIcon,
  Dumbbell as DumbbellIcon,
  User,
  UserCheck,
  UserPlus,
  UserX,
  UserMinus,
  UserCog,
  UserSearch,
} from "lucide-react";
import { WorkoutPlan, WorkoutExercise } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { mockExercises, mockWorkoutPlans, mockClients } from "@/lib/mockData";
import { LoadingPage } from "@/components/ui/loading";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { logger, logApiError } from "@/lib/logger";
import { Client } from "@/lib/types";

// Workout templates data
const workoutTemplates = [
  {
    id: "wt1",
    name: "Fat Loss Circuit",
    description: "High-intensity circuit training for maximum calorie burn",
    level: "Intermediate",
    duration: "45 min",
    goals: ["Weight Loss", "Cardio"],
    color: "bg-red-500/10",
    icon: <TargetIcon className="h-4 w-4 text-red-600" />,
    exercises: [
      { name: "Burpees", sets: 3, reps: "10", notes: "Rest 30s between sets" },
      { name: "Mountain Climbers", sets: 3, reps: "20", notes: "Keep core tight" },
      { name: "Jump Squats", sets: 3, reps: "15", notes: "Land softly" },
      { name: "Push-ups", sets: 3, reps: "8-12", notes: "Modify on knees if needed" },
      { name: "Plank", sets: 3, reps: "45s", notes: "Hold steady position" },
    ]
  },
  {
    id: "wt2",
    name: "Muscle Builder",
    description: "Compound movements for building lean muscle mass",
    level: "Intermediate",
    duration: "60 min",
    goals: ["Muscle Gain", "Strength"],
    color: "bg-blue-500/10",
    icon: <DumbbellIcon className="h-4 w-4 text-blue-600" />,
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", notes: "Rest 2-3 min between sets" },
      { name: "Pull-ups", sets: 4, reps: "6-8", notes: "Use assistance if needed" },
      { name: "Overhead Press", sets: 3, reps: "8-10", notes: "Keep core engaged" },
      { name: "Barbell Rows", sets: 3, reps: "10-12", notes: "Squeeze shoulder blades" },
      { name: "Dips", sets: 3, reps: "10-15", notes: "Control the descent" },
    ]
  },
  {
    id: "wt3",
    name: "Endurance Builder",
    description: "Improve cardiovascular fitness and stamina",
    level: "Beginner",
    duration: "30 min",
    goals: ["Endurance", "Cardio"],
    color: "bg-green-500/10",
    icon: <Clock className="h-4 w-4 text-green-600" />,
    exercises: [
      { name: "Easy Run", sets: 1, reps: "20 min", notes: "Conversational pace" },
      { name: "Lunges", sets: 3, reps: "12 each leg", notes: "Focus on form" },
      { name: "Single Leg Deadlifts", sets: 3, reps: "10 each", notes: "Balance and control" },
      { name: "Calf Raises", sets: 3, reps: "20", notes: "Full range of motion" },
      { name: "Plank", sets: 3, reps: "60s", notes: "Build core endurance" },
    ]
  },
  {
    id: "wt4",
    name: "Functional Fitness",
    description: "Movement-based training for everyday activities",
    level: "Beginner",
    duration: "40 min",
    goals: ["Functional", "Mobility"],
    color: "bg-purple-500/10",
    icon: <Users className="h-4 w-4 text-purple-600" />,
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: "12-15", notes: "Keep chest up" },
      { name: "Farmer's Walk", sets: 3, reps: "30s", notes: "Maintain posture" },
      { name: "Turkish Get-ups", sets: 2, reps: "5 each side", notes: "Focus on control" },
      { name: "Box Step-ups", sets: 3, reps: "10 each leg", notes: "Step down slowly" },
      { name: "Bear Crawl", sets: 3, reps: "20s", notes: "Keep hips low" },
    ]
  },
  {
    id: "wt5",
    name: "Beginner Total Body",
    description: "Perfect introduction to fitness for beginners",
    level: "Beginner",
    duration: "25 min",
    goals: ["General Fitness", "Beginner"],
    color: "bg-orange-500/10",
    icon: <TargetIcon className="h-4 w-4 text-orange-600" />,
    exercises: [
      { name: "Bodyweight Squats", sets: 2, reps: "10-12", notes: "Focus on form" },
      { name: "Wall Push-ups", sets: 2, reps: "8-10", notes: "Build up to regular push-ups" },
      { name: "Assisted Lunges", sets: 2, reps: "8 each leg", notes: "Use chair for balance" },
      { name: "Plank", sets: 2, reps: "20-30s", notes: "Build up gradually" },
      { name: "Marching in Place", sets: 1, reps: "2 min", notes: "Warm up and cool down" },
    ]
  },
  {
    id: "wt6",
    name: "Advanced Strength",
    description: "High-intensity strength training for advanced athletes",
    level: "Advanced",
    duration: "75 min",
    goals: ["Strength", "Power"],
    color: "bg-indigo-500/10",
    icon: <DumbbellIcon className="h-4 w-4 text-indigo-600" />,
    exercises: [
      { name: "Deadlifts", sets: 5, reps: "5", notes: "Heavy weight, perfect form" },
      { name: "Squats", sets: 4, reps: "6-8", notes: "Full depth, controlled descent" },
      { name: "Bench Press", sets: 4, reps: "6-8", notes: "Spotter recommended" },
      { name: "Pull-ups", sets: 4, reps: "8-10", notes: "Full range of motion" },
      { name: "Overhead Press", sets: 3, reps: "6-8", notes: "Strict form" },
    ]
  }
];

const WorkoutCard = ({ plan, onView, onEdit, onDuplicate, onStart, onDelete, getClientName, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: plan.name,
    description: plan.description
  });

  const handleSave = () => {
    onSave(plan.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ name: plan.name, description: plan.description });
    setIsEditing(false);
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView(plan);
        }
      }}
      role="button"
      aria-label={`Workout plan: ${plan.name} for ${getClientName(plan.clientId) || 'Unassigned'}. ${plan.exercises.length} exercises. Click to view details.`}
    >
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2 sm:space-y-3">
                <input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="text-lg sm:text-xl font-bold bg-transparent border-b-2 border-primary/60 px-2 py-1 w-full focus:outline-none focus:border-primary transition-colors"
                  placeholder="Workout name"
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="text-xs sm:text-sm text-gray-600 bg-transparent border border-gray-200 rounded-md px-2 sm:px-3 py-2 w-full resize-none focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Description"
                  rows={2}
                />
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90 text-xs sm:text-sm">
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="text-xs sm:text-sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                    <DumbbellIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {plan.name}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">For: {getClientName(plan.clientId) || "Unassigned"}</span>
                    </div>
                    {plan.description && (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {plan.description}
                      </p>
                    )}

                {plan.aiNotes && plan.aiNotes.length > 0 && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-purple-100 rounded-lg">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-purple-800">AI Recommendations</h4>
                    </div>
                    <ul className="space-y-1.5 pl-2">
                      {plan.aiNotes.map((note, index) => (
                        <li key={index} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
      {!isEditing && (
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(plan)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10 hover:text-primary"
                aria-label={`View details for ${plan.name}`}
                title="View details"
              >
                <TargetIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10 hover:text-primary"
                aria-label={`Edit ${plan.name}`}
                title="Edit workout"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(plan)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10 hover:text-primary"
                aria-label={`Duplicate ${plan.name}`}
                title="Duplicate workout"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStart(plan)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-green-500/10 hover:text-green-600"
                aria-label={`Start session with ${plan.name}`}
                title="Start session"
              >
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(plan)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-500/10 hover:text-red-600"
                aria-label={`Delete ${plan.name}`}
                title="Delete workout"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              </div>
            )}
                </div>
      </CardHeader>
      {!isEditing && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <TargetIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{plan.exercises.length} exercises</span>
                </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{plan.exercises.length * 5} min est.</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Active
              </Badge>
            </div>
        </CardContent>
      )}
    </Card>
  );
};

const ExerciseCard = ({ exercise }) => (
  <Card className="hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50 group">
    <CardHeader className="pb-2 sm:pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
            {exercise.name}
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
            {exercise.category}
          </Badge>
        </div>
        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <DumbbellIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
        {exercise.description}
      </p>
    </CardContent>
  </Card>
);

// Simple Create Workout Dialog
const CreateWorkoutDialog = ({ isOpen, onClose, onWorkoutCreated, clients }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [workoutData, setWorkoutData] = useState({
    clientId: "",
    name: "",
    description: "",
  });

  const isDemoAccount = user?.email === "trainer@demo.com" || user?.uid === "demo-user-123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!user?.uid) {
      toast({
        title: "Error",
        description: "You must be logged in to create a workout plan.",
        variant: "destructive",
      });
      return;
    }
    
    if (!workoutData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!workoutData.clientId) {
      toast({
        title: "Error",
        description: "Please select a client for this workout plan.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const newWorkout = {
        ...workoutData,
        name: workoutData.name.trim(),
        description: workoutData.description.trim(),
        exercises: [],
        isActive: true,
        createdDate: new Date().toISOString(),
      };
      
      if (!isDemoAccount) {
        const workoutPlansCollection = collection(db, "users", user.uid, "workoutPlans");
        await addDoc(workoutPlansCollection, newWorkout);
      }
      
      onWorkoutCreated();
      onClose();
      
      // Reset form
      setWorkoutData({
        clientId: "",
        name: "",
        description: "",
      });
      
      toast({
        title: "Workout created",
        description: "New workout plan has been successfully created.",
      });
    } catch (error) {
      logApiError("creating workout", error, { workoutName: workoutData.name, clientId: workoutData.clientId });
      toast({
        title: "Error",
        description: "Failed to create workout. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl mx-4">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Create New Workout Plan
            </DialogTitle>
        </div>
          <DialogDescription className="text-sm text-gray-600">
            Create a personalized workout plan for your client. You can add exercises later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Client</label>
              <select
                value={workoutData.clientId}
                onChange={(e) => setWorkoutData({ ...workoutData, clientId: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
        </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Workout Name</label>
            <Input
                value={workoutData.name}
                onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
                placeholder="e.g., Upper Body Strength"
                className="h-10 sm:h-12 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                required
            />
          </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={workoutData.description}
                onChange={(e) => setWorkoutData({ ...workoutData, description: e.target.value })}
                placeholder="Brief description of the workout plan..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg bg-white resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
                rows={3}
              />
        </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
          <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 sm:px-6 py-2 border-gray-200 hover:bg-gray-50 text-sm"
            >
              Cancel
          </Button>
          <Button
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 shadow-lg hover:shadow-xl transition-all text-sm"
          >
              {loading ? "Creating..." : "Create Plan"}
          </Button>
        </div>
        </form>
          </DialogContent>
        </Dialog>
  );
};

// Simple View/Edit Workout Dialog
const ViewWorkoutDialog = ({ workout, isOpen, onClose, onSave, getClientName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    name: workout?.name || "",
    description: workout?.description || "",
    exercises: workout?.exercises || []
  });
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    notes: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const isDemoAccount = user?.email === "trainer@demo.com" || user?.uid === "demo-user-123";

  // Update workout data when workout changes
  useEffect(() => {
    if (workout) {
      setWorkoutData({
        name: workout.name,
        description: workout.description,
        exercises: [...workout.exercises]
      });
    }
  }, [workout]);

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an exercise name.",
        variant: "destructive",
      });
      return;
    }

    const exercise = {
      id: Date.now().toString(),
      name: newExercise.name.trim(),
      sets: parseInt(newExercise.sets) || 0,
      reps: newExercise.reps.trim(),
      weight: newExercise.weight.trim(),
      duration: newExercise.duration.trim(),
      notes: newExercise.notes.trim()
    };

    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));

    setNewExercise({
      name: "",
      sets: "",
      reps: "",
      weight: "",
      duration: "",
      notes: ""
    });
    
    toast({
      title: "Exercise added",
      description: `${exercise.name} has been added to the workout plan.`,
    });
  };

  const handleRemoveExercise = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!workout) return;
    
    // Enhanced validation
    if (!workoutData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name.",
        variant: "destructive",
      });
      return;
    }
    
    if (workoutData.exercises.length === 0) {
      toast({
        title: "Warning",
        description: "This workout plan has no exercises. Consider adding some exercises.",
        variant: "destructive",
      });
    }
    
    try {
      if (!isDemoAccount) {
        const workoutDoc = doc(db, "users", user.uid, "workoutPlans", workout.id);
        await updateDoc(workoutDoc, {
          name: workoutData.name.trim(),
          description: workoutData.description.trim(),
          exercises: workoutData.exercises
        });
      }
      
      onSave(workout.id, workoutData);
      setIsEditing(false);
      onClose();
      
      toast({
        title: "Workout updated",
        description: "Workout plan has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating workout:", error);
      toast({
        title: "Error",
        description: "Failed to update workout. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  if (!workout) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[700px] max-h-[85vh] overflow-y-auto bg-white border-0 shadow-2xl mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <DumbbellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            {isEditing ? (
              <input
                value={workoutData.name}
                onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
                className="text-lg sm:text-xl font-semibold bg-transparent border-b-2 border-primary/60 px-2 py-1 focus:outline-none focus:border-primary transition-colors"
              />
            ) : (
              workoutData.name
            )}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Workout plan for {getClientName(workout.clientId)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            {isEditing ? (
              <textarea
                value={workoutData.description}
                onChange={(e) => setWorkoutData({ ...workoutData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white resize-none focus:outline-none focus:border-primary/50 transition-colors text-sm"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-600">{workoutData.description}</p>
            )}
          </div>

          {/* Exercises */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                <TargetIcon className="h-4 w-4" />
                Exercises ({workoutData.exercises.length})
              </h4>
              {isEditing && (
                <Button size="sm" onClick={handleAddExercise} disabled={!newExercise.name} className="text-xs sm:text-sm">
                  Add Exercise
                </Button>
              )}
            </div>

            {/* Add Exercise Form */}
            {isEditing && (
              <div className="p-3 sm:p-4 border rounded-lg bg-gray-50 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Exercise Name</label>
                    <select
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs sm:text-sm bg-white focus:outline-none focus:border-primary"
                    >
                      <option value="">Select exercise</option>
                      {mockExercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.name}>
                          {exercise.name} ({exercise.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Sets</label>
                    <Input
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                      placeholder="3"
                      className="text-xs sm:text-sm border-gray-200 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Reps</label>
                    <Input
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                      placeholder="10-12"
                      className="text-xs sm:text-sm border-gray-200 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Weight</label>
                    <Input
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                      placeholder="50 lbs"
                      className="text-xs sm:text-sm border-gray-200 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Duration</label>
                    <Input
                      value={newExercise.duration}
                      onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                      placeholder="30 sec"
                      className="text-xs sm:text-sm border-gray-200 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Notes</label>
                  <Input
                    value={newExercise.notes}
                    onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                    placeholder="Focus on form, rest 60 seconds..."
                    className="text-xs sm:text-sm border-gray-200 focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* Exercise List */}
            <div className="space-y-2 sm:space-y-3">
              {workoutData.exercises.map((exercise, index) => (
                <Card key={exercise.id} className="border-gray-200">
                  <CardContent className="pt-3 sm:pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-primary text-white text-xs rounded-full">
                            {index + 1}
                          </span>
                          <h5 className="font-medium text-gray-900 text-sm sm:text-base truncate">{exercise.name}</h5>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
                          {exercise.sets > 0 && (
                            <div>
                              <span className="text-gray-600">Sets:</span> {exercise.sets}
                            </div>
                          )}
                          {exercise.reps && (
                            <div>
                              <span className="text-gray-600">Reps:</span> {exercise.reps}
                            </div>
                          )}
                          {exercise.weight && (
                            <div>
                              <span className="text-gray-600">Weight:</span> {exercise.weight}
                            </div>
                          )}
                          {exercise.duration && (
                            <div>
                              <span className="text-gray-600">Duration:</span> {exercise.duration}
                            </div>
                          )}
                        </div>
                        {exercise.notes && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-2">
                            <span className="font-medium">Notes:</span> {exercise.notes}
                          </p>
                        )}
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExercise(index)}
                          className="text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 sm:pt-4 border-t border-gray-200">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-200 hover:bg-gray-50 text-sm">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-sm">
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} className="border-gray-200 hover:bg-gray-50 text-sm">
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90 text-sm">
                Edit Workout
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Workouts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<WorkoutPlan | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check if this is the demo account
  const isDemoAccount = user?.email === "trainer@demo.com" || user?.uid === "demo-user-123";

  // Use DataContext instead of direct Firestore calls
  const { clients: contextClients, loading: contextLoading } = useData();
  
  // Load data once on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      if (isDemoAccount) {
        setWorkoutPlans(mockWorkoutPlans);
        setClients(mockClients);
        setLoading(false);
        return;
      }

      try {
        // Load workout plans
        const workoutPlansCollection = collection(db, "users", user.uid, "workoutPlans");
        const workoutSnapshot = await getDocs(workoutPlansCollection);
        const plans = workoutSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutPlan));
        setWorkoutPlans(plans);

        // Use DataContext clients
        setClients(contextClients || []);
    } catch (error) {
        console.error("Error loading data:", error);
      toast({
        title: "Error",
          description: "Failed to load data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

    loadData();
  }, [user?.uid, user?.email, contextClients, isDemoAccount]);

  const handleDuplicateWorkout = async (workout: WorkoutPlan) => {
    if (!user?.uid) return;
    
    try {
      const { id, createdDate, ...planToCopy } = workout;
      const duplicatedWorkout = {
        ...planToCopy,
        name: `${workout.name} (Copy)`,
        createdDate: new Date().toISOString(),
      };
      
      if (!isDemoAccount) {
        const workoutPlansCollection = collection(db, "users", user.uid, "workoutPlans");
        const docRef = await addDoc(workoutPlansCollection, duplicatedWorkout);
        
        // Update local state immediately
        setWorkoutPlans(prev => [...prev, { ...duplicatedWorkout, id: docRef.id }]);
      } else {
        // For demo account, just update local state
        const newId = `demo-${Date.now()}`;
        setWorkoutPlans(prev => [...prev, { ...duplicatedWorkout, id: newId }]);
      }
      
      toast({
        title: "Workout duplicated",
        description: "Workout plan has been successfully duplicated.",
      });
    } catch (error) {
      console.error("Error duplicating workout:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkout = (workout: WorkoutPlan) => {
    setWorkoutToDelete(workout);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWorkout = async () => {
    if (!user?.uid || !workoutToDelete) return;
    
    try {
      if (!isDemoAccount) {
        const workoutDoc = doc(db, "users", user.uid, "workoutPlans", workoutToDelete.id);
        await deleteDoc(workoutDoc);
        
        // Update local state immediately
        setWorkoutPlans(prev => prev.filter(plan => plan.id !== workoutToDelete.id));
      } else {
        // For demo account, just update local state
        setWorkoutPlans(prev => prev.filter(plan => plan.id !== workoutToDelete.id));
      }
      
      toast({
        title: "Workout deleted",
        description: "Workout plan has been successfully deleted.",
      });
    } catch (error) {
      logApiError("deleting workout", error, { workoutId: workoutToDelete.id, workoutName: workoutToDelete.name });
      toast({
        title: "Error",
        description: "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setWorkoutToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleStartSession = (workout: WorkoutPlan) => {
    // Simple navigation to sessions page
    navigate("/sessions");
    toast({
      title: "Session started",
      description: "Navigate to Sessions page to manage your session.",
    });
  };

  const handleViewWorkout = (workout: WorkoutPlan) => {
    setSelectedWorkout(workout);
    setShowViewDialog(true);
  };

  const handleEditWorkout = (workout: WorkoutPlan) => {
    // Open the view dialog for editing
    setSelectedWorkout(workout);
    setShowViewDialog(true);
  };

  const handleSaveWorkout = async (workoutId: string, updatedData: { name: string; description: string }) => {
    if (!user?.uid) return;
    
    try {
      if (!isDemoAccount) {
        const workoutDoc = doc(db, "users", user.uid, "workoutPlans", workoutId);
        await updateDoc(workoutDoc, {
          name: updatedData.name,
          description: updatedData.description,
        });
        
        // Update local state
        setWorkoutPlans(prev => 
          prev.map(plan => 
            plan.id === workoutId 
              ? { ...plan, name: updatedData.name, description: updatedData.description }
              : plan
          )
        );
        } else {
        // For demo account, just update local state
        setWorkoutPlans(prev => 
          prev.map(plan => 
            plan.id === workoutId 
              ? { ...plan, name: updatedData.name, description: updatedData.description }
              : plan
          )
        );
      }
      
      toast({
        title: "Workout updated",
        description: "Workout plan has been successfully updated.",
      });
      } catch (error) {
      console.error("Error updating workout:", error);
        toast({
          title: "Error",
        description: "Failed to update workout. Please try again.",
          variant: "destructive",
        });
    }
  };

  const handleSaveWorkoutDetails = async (workoutId: string, updatedData: any) => {
    if (!user?.uid) return;
    
    try {
      if (!isDemoAccount) {
        const workoutDoc = doc(db, "users", user.uid, "workoutPlans", workoutId);
        await updateDoc(workoutDoc, {
          name: updatedData.name,
          description: updatedData.description,
          exercises: updatedData.exercises,
        });
      }
      
      // Update local state
      setWorkoutPlans(prev => 
        prev.map(plan => 
          plan.id === workoutId 
            ? { ...plan, ...updatedData }
            : plan
        )
      );
      
        toast({
        title: "Workout updated",
        description: "Workout plan has been successfully updated.",
        });
      } catch (error) {
      console.error("Error updating workout:", error);
        toast({
          title: "Error",
        description: "Failed to update workout. Please try again.",
          variant: "destructive",
        });
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || "Unknown Client";
  };

  const handleWorkoutCreated = async () => {
    // Reload workout plans
    if (!user?.uid) return;

    if (isDemoAccount) {
      setWorkoutPlans(mockWorkoutPlans);
      return;
    }

    try {
      const workoutPlansCollection = collection(db, "users", user.uid, "workoutPlans");
      const snapshot = await getDocs(workoutPlansCollection);
      const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutPlan));
      setWorkoutPlans(plans);
    } catch (error) {
      console.error("Error reloading workout plans:", error);
    }
  };

  // Generate AI recommendation based on client data
  const generateAIRecommendation = (client: any) => {
    const { fitnessLevel, goals } = client;
    
    // Simple AI logic based on client goals and fitness level
    let recommendedTemplate;
    
    if (goals.toLowerCase().includes('weight loss') || goals.toLowerCase().includes('fat loss')) {
      recommendedTemplate = workoutTemplates.find(t => t.name === "Fat Loss Circuit");
    } else if (goals.toLowerCase().includes('muscle') || goals.toLowerCase().includes('strength')) {
      recommendedTemplate = workoutTemplates.find(t => t.name === "Muscle Builder");
    } else if (goals.toLowerCase().includes('endurance') || goals.toLowerCase().includes('cardio')) {
      recommendedTemplate = workoutTemplates.find(t => t.name === "Endurance Builder");
    } else if (fitnessLevel === 'beginner') {
      recommendedTemplate = workoutTemplates.find(t => t.name === "Beginner Total Body");
    } else {
      recommendedTemplate = workoutTemplates.find(t => t.name === "Functional Fitness");
    }

    // Create a workout plan from the template
    return {
      id: `ai-${Date.now()}`,
      clientId: client.id,
      name: `${client.name}'s ${recommendedTemplate?.name || 'Personalized'} Program`,
      description: `AI-recommended ${recommendedTemplate?.description || 'workout plan'} based on your goals: ${goals}`,
      exercises: recommendedTemplate?.exercises.map((ex, index) => ({
        id: `ai-ex-${index}`,
        ...ex
      })) || [],
      createdDate: new Date().toISOString(),
      isActive: true
    };
  };

  // Handle creating workout from template
  const handleCreateFromTemplate = (template: any) => {
    setShowCreateDialog(true);
    // You could pre-populate the create dialog with template data
    toast({
      title: "Template Selected",
      description: `Ready to create "${template.name}" for your client.`,
    });
  };

  if (loading) {
    return <LoadingPage text="Loading workouts..." />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
            <div className="space-y-2">
                      <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg sm:rounded-xl">
                  <DumbbellIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                    Workouts
                  </h1>
                  <p className="text-sm sm:text-lg text-gray-600">
                    Create and manage personalized workout plans
                  </p>
                      </div>
                    </div>
            </div>
                      <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 h-auto text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Create New Plan
                      </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                  <TargetIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{workoutPlans.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg">
                  <DumbbellIcon className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Exercises</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{mockExercises.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
                    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg col-span-2 sm:col-span-1">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-orange-500/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Duration</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {workoutPlans.length > 0 
                      ? Math.round(workoutPlans.reduce((total, plan) => total + plan.exercises.length, 0) / workoutPlans.length * 5)
                      : 0} min
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20">
          <Tabs defaultValue="plans" className="w-full">
            <div className="border-b border-gray-200">
              <div className="px-4 sm:px-6 py-3 sm:py-4">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-100 p-1 rounded-lg sm:rounded-xl h-auto">
                  <TabsTrigger 
                    value="plans" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4 py-2"
                  >
                    <TargetIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">My Plans</span>
                    <span className="sm:hidden">Plans</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4 py-2"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Templates</span>
                    <span className="sm:hidden">Templates</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="library" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4 py-2"
                  >
                    <DumbbellIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Exercise Library</span>
                    <span className="sm:hidden">Library</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md sm:rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4 py-2"
                  >
                    <TrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Analytics</span>
                    <span className="sm:hidden">Stats</span>
                  </TabsTrigger>
                </TabsList>
        </div>
            </div>
            
            <TabsContent value="plans" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {workoutPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {workoutPlans.map((plan) => (
                    <WorkoutCard
                      key={plan.id}
                      plan={plan}
                      onView={handleViewWorkout}
                      onEdit={handleEditWorkout}
                      onDuplicate={handleDuplicateWorkout}
                      onStart={handleStartSession}
                      onDelete={handleDeleteWorkout}
                      getClientName={getClientName}
                      onSave={handleSaveWorkout}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                    <div className="p-3 sm:p-4 bg-primary/10 rounded-full mb-3 sm:mb-4">
                      <DumbbellIcon className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">
                      No workout plans yet
                    </h3>
                    <p className="text-gray-600 text-center mb-4 sm:mb-6 max-w-md px-4">
                      Get started by creating your first personalized workout plan for your clients.
                    </p>
                    <Button 
                      onClick={() => setShowCreateDialog(true)}
                      className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Plan
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="templates" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* AI Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-100">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <TargetIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Get personalized workout suggestions based on your clients' goals</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {clients.slice(0, 3).map((client) => (
                    <Card key={client.id} className="border-blue-200 bg-white/80">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-medium text-blue-700">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">{client.name}</h4>
                            <p className="text-xs text-gray-600">{client.fitnessLevel} • {client.goals}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                          onClick={() => {
                            const recommendation = generateAIRecommendation(client);
                            setSelectedWorkout(recommendation);
                            setShowViewDialog(true);
                          }}
                        >
                          <TargetIcon className="h-3 w-3 mr-1" />
                          Get Recommendation
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Workout Templates */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Workout Templates</h3>
                    <p className="text-gray-600 text-sm">Choose from proven workout templates for different goals</p>
            </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm bg-white focus:border-primary focus:outline-none">
                      <option value="all">All Goals</option>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="strength">Strength</option>
                      <option value="flexibility">Flexibility</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm bg-white focus:border-primary focus:outline-none">
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
          </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {workoutTemplates.map((template) => (
                    <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50/50">
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${template.color}`}>
                                {template.icon}
                              </div>
                              <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
                                {template.name}
                              </CardTitle>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">{template.description}</p>
                            <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                                <TargetIcon className="h-3 w-3" />
                                {template.exercises.length} exercises
              </span>
              <span className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                {template.duration}
              </span>
                              <Badge variant="outline" className="text-xs">
                                {template.level}
                              </Badge>
            </div>
          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Goals:</span>
                            <div className="flex flex-wrap gap-1">
                              {template.goals.map((goal, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary">
                                  {goal}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm"
                            onClick={() => handleCreateFromTemplate(template)}
                          >
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="library" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search exercises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-primary focus:ring-primary text-sm"
                    />
                </div>
              </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg bg-white focus:border-primary focus:ring-primary focus:outline-none text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exercise Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredExercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg">
                        <TargetIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Active Plans</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">
                          {workoutPlans.filter(p => p.isActive).length}
                        </p>
          </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                        <UsersIcon className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
          </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Clients with Plans</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">
                          {new Set(workoutPlans.map(p => p.clientId)).size}
                        </p>
        </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg">
                        <DumbbellIcon className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
        </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Total Exercises</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">
                          {workoutPlans.reduce((total, plan) => total + plan.exercises.length, 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-orange-500/10 rounded-lg">
                        <TrendingUpIcon className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Duration</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">
                          {workoutPlans.length > 0 
                            ? Math.round(workoutPlans.reduce((total, plan) => total + plan.exercises.length, 0) / workoutPlans.length * 5)
                            : 0} min
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Client Progress Chart */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    Client Workout Progress
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Track how your clients are progressing with their workout plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {clients.slice(0, 5).map((client) => {
                      const clientPlans = workoutPlans.filter(p => p.clientId === client.id);
                      const totalExercises = clientPlans.reduce((total, plan) => total + plan.exercises.length, 0);
                      const progressPercentage = Math.min((totalExercises / 20) * 100, 100);
                      
                      return (
                        <div key={client.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg bg-gray-50/50">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs sm:text-sm font-medium text-primary">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{client.name}</h4>
                              <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0 ml-2">{totalExercises} exercises</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Exercises */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <DumbbellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    Most Popular Exercises
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Exercises most commonly included in your workout plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    {(() => {
                      const exerciseCounts: { [key: string]: number } = {};
                      workoutPlans.forEach(plan => {
                        plan.exercises.forEach(exercise => {
                          exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
                        });
                      });
                      
                      const topExercises = Object.entries(exerciseCounts)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5);
                      
                      return topExercises.map(([exerciseName, count], index) => (
                        <div key={exerciseName} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg bg-gray-50/50">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs sm:text-sm font-medium text-primary">{index + 1}</span>
                            </div>
                            <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{exerciseName}</span>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs flex-shrink-0 ml-2">
                            {count} plans
                          </Badge>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs */}
        <CreateWorkoutDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onWorkoutCreated={handleWorkoutCreated}
          clients={clients}
        />

        <ViewWorkoutDialog
          workout={selectedWorkout}
          isOpen={showViewDialog}
          onClose={() => {
            setShowViewDialog(false);
            setSelectedWorkout(null);
          }}
          onSave={handleSaveWorkoutDetails}
          getClientName={getClientName}
        />

        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Workout Plan"
          description={`Are you sure you want to delete "${workoutToDelete?.name}"? This action cannot be undone and will remove all associated exercise data.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={confirmDeleteWorkout}
        />
      </div>
    </div>
  );
};

export default Workouts; 
