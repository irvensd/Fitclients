import { Client, Session, Payment, WorkoutPlan, Exercise } from "./types";

// Comprehensive exercise library for workout creation
export const mockExercises = [
  // Chest exercises
  {
    id: "ex1",
    name: "Push-ups",
    category: "Chest",
    description: "Basic bodyweight exercise for chest and arms",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex2",
    name: "Bench Press",
    category: "Chest",
    description: "Classic barbell chest exercise",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    id: "ex3",
    name: "Dumbbell Flyes",
    category: "Chest",
    description: "Isolation exercise for chest development",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
  },
  {
    id: "ex4",
    name: "Incline Press",
    category: "Chest",
    description: "Upper chest focused pressing movement",
    equipment: "Barbell/Dumbbell",
    difficulty: "Intermediate",
  },
  {
    id: "ex5",
    name: "Dips",
    category: "Chest",
    description: "Bodyweight exercise for chest and triceps",
    equipment: "Dip Station",
    difficulty: "Intermediate",
  },
  {
    id: "ex6",
    name: "Chest Press Machine",
    category: "Chest",
    description: "Machine-based chest exercise",
    equipment: "Machine",
    difficulty: "Beginner",
  },

  // Back exercises
  {
    id: "ex7",
    name: "Pull-ups",
    category: "Back",
    description: "Upper body pulling exercise",
    equipment: "Pull-up Bar",
    difficulty: "Intermediate",
  },
  {
    id: "ex8",
    name: "Deadlifts",
    category: "Back",
    description: "Compound strength exercise",
    equipment: "Barbell",
    difficulty: "Advanced",
  },
  {
    id: "ex9",
    name: "Barbell Rows",
    category: "Back",
    description: "Horizontal pulling movement",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    id: "ex10",
    name: "Lat Pulldowns",
    category: "Back",
    description: "Machine-based lat exercise",
    equipment: "Cable Machine",
    difficulty: "Beginner",
  },
  {
    id: "ex11",
    name: "T-Bar Rows",
    category: "Back",
    description: "Thick grip rowing exercise",
    equipment: "T-Bar",
    difficulty: "Intermediate",
  },
  {
    id: "ex12",
    name: "Cable Rows",
    category: "Back",
    description: "Seated cable rowing",
    equipment: "Cable Machine",
    difficulty: "Beginner",
  },

  // Leg exercises
  {
    id: "ex13",
    name: "Squats",
    category: "Legs",
    description: "Fundamental lower body exercise",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    id: "ex14",
    name: "Lunges",
    category: "Legs",
    description: "Single-leg strength exercise",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex15",
    name: "Leg Press",
    category: "Legs",
    description: "Machine-based leg exercise",
    equipment: "Machine",
    difficulty: "Beginner",
  },
  {
    id: "ex16",
    name: "Romanian Deadlifts",
    category: "Legs",
    description: "Hamstring-focused deadlift variation",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    id: "ex17",
    name: "Bulgarian Split Squats",
    category: "Legs",
    description: "Single-leg squat variation",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
  },
  {
    id: "ex18",
    name: "Calf Raises",
    category: "Legs",
    description: "Calf muscle isolation",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex19",
    name: "Leg Curls",
    category: "Legs",
    description: "Hamstring isolation exercise",
    equipment: "Machine",
    difficulty: "Beginner",
  },
  {
    id: "ex20",
    name: "Leg Extensions",
    category: "Legs",
    description: "Quadriceps isolation",
    equipment: "Machine",
    difficulty: "Beginner",
  },

  // Shoulder exercises
  {
    id: "ex21",
    name: "Overhead Press",
    category: "Shoulders",
    description: "Vertical pressing movement",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    id: "ex22",
    name: "Lateral Raises",
    category: "Shoulders",
    description: "Side deltoid isolation",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex23",
    name: "Rear Delt Flyes",
    category: "Shoulders",
    description: "Posterior deltoid exercise",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex24",
    name: "Front Raises",
    category: "Shoulders",
    description: "Anterior deltoid isolation",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex25",
    name: "Upright Rows",
    category: "Shoulders",
    description: "Shoulder and trap exercise",
    equipment: "Barbell",
    difficulty: "Intermediate",
  },
  {
    id: "ex26",
    name: "Shoulder Shrugs",
    category: "Shoulders",
    description: "Trapezius muscle exercise",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },

  // Arms exercises
  {
    id: "ex27",
    name: "Bicep Curls",
    category: "Arms",
    description: "Basic bicep exercise",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex28",
    name: "Tricep Extensions",
    category: "Arms",
    description: "Tricep isolation exercise",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex29",
    name: "Hammer Curls",
    category: "Arms",
    description: "Neutral grip bicep exercise",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex30",
    name: "Close-Grip Push-ups",
    category: "Arms",
    description: "Tricep-focused push-up variation",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
  },
  {
    id: "ex31",
    name: "Cable Curls",
    category: "Arms",
    description: "Cable-based bicep exercise",
    equipment: "Cable Machine",
    difficulty: "Beginner",
  },
  {
    id: "ex32",
    name: "Tricep Dips",
    category: "Arms",
    description: "Bodyweight tricep exercise",
    equipment: "Bench",
    difficulty: "Intermediate",
  },

  // Core exercises
  {
    id: "ex33",
    name: "Planks",
    category: "Core",
    description: "Core stability exercise",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex34",
    name: "Crunches",
    category: "Core",
    description: "Basic abdominal exercise",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex35",
    name: "Russian Twists",
    category: "Core",
    description: "Rotational core exercise",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex36",
    name: "Dead Bug",
    category: "Core",
    description: "Core stability and control",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex37",
    name: "Bicycle Crunches",
    category: "Core",
    description: "Dynamic abdominal exercise",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex38",
    name: "Hanging Leg Raises",
    category: "Core",
    description: "Advanced core exercise",
    equipment: "Pull-up Bar",
    difficulty: "Advanced",
  },

  // Cardio exercises
  {
    id: "ex39",
    name: "Burpees",
    category: "Cardio",
    description: "Full body cardio exercise",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
  },
  {
    id: "ex40",
    name: "Mountain Climbers",
    category: "Cardio",
    description: "Dynamic core and cardio exercise",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex41",
    name: "Jumping Jacks",
    category: "Cardio",
    description: "Basic cardio movement",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex42",
    name: "High Knees",
    category: "Cardio",
    description: "Running in place variation",
    equipment: "Bodyweight",
    difficulty: "Beginner",
  },
  {
    id: "ex43",
    name: "Jump Squats",
    category: "Cardio",
    description: "Explosive squat variation",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
  },
  {
    id: "ex44",
    name: "Battle Ropes",
    category: "Cardio",
    description: "High-intensity rope exercise",
    equipment: "Battle Ropes",
    difficulty: "Intermediate",
  },

  // Functional exercises
  {
    id: "ex45",
    name: "Turkish Get-ups",
    category: "Functional",
    description: "Full body functional movement",
    equipment: "Kettlebell",
    difficulty: "Advanced",
  },
  {
    id: "ex46",
    name: "Farmer's Walk",
    category: "Functional",
    description: "Grip and core strength",
    equipment: "Dumbbells",
    difficulty: "Beginner",
  },
  {
    id: "ex47",
    name: "Box Step-ups",
    category: "Functional",
    description: "Unilateral leg exercise",
    equipment: "Box",
    difficulty: "Beginner",
  },
  {
    id: "ex48",
    name: "Kettlebell Swings",
    category: "Functional",
    description: "Hip hinge movement pattern",
    equipment: "Kettlebell",
    difficulty: "Intermediate",
  },
  {
    id: "ex49",
    name: "Bear Crawl",
    category: "Functional",
    description: "Full body stability exercise",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
  },
  {
    id: "ex50",
    name: "Wall Sits",
    category: "Functional",
    description: "Isometric leg exercise",
    equipment: "Wall",
    difficulty: "Beginner",
  },
];

// Comprehensive workout plan templates
export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: "wp1",
    clientId: "1", // Sarah Johnson
    name: "Fat Loss Circuit Training",
    description:
      "High-intensity circuit training focused on calorie burn and weight loss",
    exercises: [
      {
        id: "e1",
        name: "Burpees",
        sets: 3,
        reps: "10",
        weight: "",
        duration: "",
        notes: "Rest 30s between sets",
      },
      {
        id: "e2",
        name: "Mountain Climbers",
        sets: 3,
        reps: "20",
        weight: "",
        duration: "",
        notes: "Keep core tight",
      },
      {
        id: "e3",
        name: "Jump Squats",
        sets: 3,
        reps: "15",
        weight: "",
        duration: "",
        notes: "Land softly",
      },
      {
        id: "e4",
        name: "Push-ups",
        sets: 3,
        reps: "8-12",
        weight: "",
        duration: "",
        notes: "Modify on knees if needed",
      },
      {
        id: "e5",
        name: "Plank",
        sets: 3,
        reps: "",
        weight: "",
        duration: "45s",
        notes: "Hold steady position",
      },
      {
        id: "e6",
        name: "Russian Twists",
        sets: 3,
        reps: "20",
        weight: "",
        duration: "",
        notes: "Engage core throughout",
      },
    ],
    createdDate: "2024-01-15",
    isActive: true,
  },
  {
    id: "wp2",
    clientId: "2", // Mike Chen
    name: "Upper Body Strength Builder",
    description:
      "Compound movements for building muscle mass in the upper body",
    exercises: [
      {
        id: "e7",
        name: "Bench Press",
        sets: 4,
        reps: "8-10",
        weight: "185 lbs",
        duration: "",
        notes: "Rest 2-3 min between sets",
      },
      {
        id: "e8",
        name: "Pull-ups",
        sets: 4,
        reps: "6-8",
        weight: "Body weight",
        duration: "",
        notes: "Use assistance if needed",
      },
      {
        id: "e9",
        name: "Overhead Press",
        sets: 3,
        reps: "8-10",
        weight: "115 lbs",
        duration: "",
        notes: "Keep core engaged",
      },
      {
        id: "e10",
        name: "Barbell Rows",
        sets: 3,
        reps: "10-12",
        weight: "135 lbs",
        duration: "",
        notes: "Squeeze shoulder blades",
      },
      {
        id: "e11",
        name: "Dips",
        sets: 3,
        reps: "10-15",
        weight: "Body weight",
        duration: "",
        notes: "Control the descent",
      },
      {
        id: "e12",
        name: "Bicep Curls",
        sets: 3,
        reps: "12-15",
        weight: "25 lbs",
        duration: "",
        notes: "Slow and controlled",
      },
    ],
    createdDate: "2024-02-03",
    isActive: true,
  },
  {
    id: "wp3",
    clientId: "3", // Emily Davis
    name: "Marathon Base Training",
    description: "Endurance and strength training for marathon preparation",
    exercises: [
      {
        id: "e13",
        name: "Easy Run",
        sets: 1,
        reps: "",
        weight: "",
        duration: "45 min",
        notes: "Maintain conversational pace",
      },
      {
        id: "e14",
        name: "Lunges",
        sets: 3,
        reps: "12 each leg",
        weight: "15 lbs",
        duration: "",
        notes: "Focus on form over speed",
      },
      {
        id: "e15",
        name: "Single Leg Deadlifts",
        sets: 3,
        reps: "10 each",
        weight: "20 lbs",
        duration: "",
        notes: "Balance and control",
      },
      {
        id: "e16",
        name: "Calf Raises",
        sets: 3,
        reps: "20",
        weight: "Body weight",
        duration: "",
        notes: "Full range of motion",
      },
      {
        id: "e17",
        name: "Plank",
        sets: 3,
        reps: "",
        weight: "",
        duration: "60s",
        notes: "Build core endurance",
      },
      {
        id: "e18",
        name: "Glute Bridges",
        sets: 3,
        reps: "15",
        weight: "",
        duration: "",
        notes: "Activate glutes",
      },
    ],
    createdDate: "2024-01-28",
    isActive: true,
  },
  {
    id: "wp4",
    clientId: "4", // James Wilson
    name: "Functional Fitness Program",
    description:
      "Movement-based training for everyday activities and injury prevention",
    exercises: [
      {
        id: "e19",
        name: "Goblet Squats",
        sets: 3,
        reps: "12-15",
        weight: "25 lbs",
        duration: "",
        notes: "Keep chest up",
      },
      {
        id: "e20",
        name: "Farmer's Walk",
        sets: 3,
        reps: "",
        weight: "40 lbs each hand",
        duration: "30s",
        notes: "Maintain posture",
      },
      {
        id: "e21",
        name: "Turkish Get-ups",
        sets: 2,
        reps: "5 each side",
        weight: "15 lbs",
        duration: "",
        notes: "Focus on control",
      },
      {
        id: "e22",
        name: "Box Step-ups",
        sets: 3,
        reps: "10 each leg",
        weight: "20 lbs",
        duration: "",
        notes: "Step down slowly",
      },
      {
        id: "e23",
        name: "Bear Crawl",
        sets: 3,
        reps: "",
        weight: "",
        duration: "20s",
        notes: "Keep hips low",
      },
      {
        id: "e24",
        name: "Dead Bug",
        sets: 3,
        reps: "10 each side",
        weight: "",
        duration: "",
        notes: "Maintain neutral spine",
      },
    ],
    createdDate: "2024-02-10",
    isActive: true,
  },
  {
    id: "wp5",
    clientId: "5", // Alex Thompson
    name: "Beginner Total Body",
    description: "Full body workout routine perfect for fitness beginners",
    exercises: [
      {
        id: "e25",
        name: "Bodyweight Squats",
        sets: 2,
        reps: "10-12",
        weight: "",
        duration: "",
        notes: "Focus on form",
      },
      {
        id: "e26",
        name: "Wall Push-ups",
        sets: 2,
        reps: "8-10",
        weight: "",
        duration: "",
        notes: "Build up to regular push-ups",
      },
      {
        id: "e27",
        name: "Assisted Lunges",
        sets: 2,
        reps: "8 each leg",
        weight: "",
        duration: "",
        notes: "Use chair for balance",
      },
      {
        id: "e28",
        name: "Plank",
        sets: 2,
        reps: "",
        weight: "",
        duration: "20-30s",
        notes: "Build up gradually",
      },
      {
        id: "e29",
        name: "Marching in Place",
        sets: 1,
        reps: "",
        weight: "",
        duration: "2 min",
        notes: "Warm up and cool down",
      },
      {
        id: "e30",
        name: "Arm Circles",
        sets: 2,
        reps: "10 each direction",
        weight: "",
        duration: "",
        notes: "Shoulder mobility",
      },
    ],
    createdDate: "2024-02-18",
    isActive: true,
  },
  {
    id: "wp6",
    clientId: "6", // Maria Rodriguez
    name: "Strength & Flexibility",
    description:
      "Balanced routine combining strength training with flexibility work",
    exercises: [
      {
        id: "e31",
        name: "Dumbbell Squats",
        sets: 3,
        reps: "12",
        weight: "20 lbs",
        duration: "",
        notes: "Full range of motion",
      },
      {
        id: "e32",
        name: "Chest Press",
        sets: 3,
        reps: "10-12",
        weight: "30 lbs",
        duration: "",
        notes: "Control the weight",
      },
      {
        id: "e33",
        name: "Lat Pulldowns",
        sets: 3,
        reps: "12",
        weight: "60 lbs",
        duration: "",
        notes: "Pull to chest",
      },
      {
        id: "e34",
        name: "Hip Flexor Stretch",
        sets: 2,
        reps: "",
        weight: "",
        duration: "30s each",
        notes: "Hold gentle stretch",
      },
      {
        id: "e35",
        name: "Hamstring Stretch",
        sets: 2,
        reps: "",
        weight: "",
        duration: "30s each",
        notes: "Seated or standing",
      },
      {
        id: "e36",
        name: "Shoulder Rolls",
        sets: 2,
        reps: "10 each direction",
        weight: "",
        duration: "",
        notes: "Release tension",
      },
    ],
    createdDate: "2024-02-13",
    isActive: true,
  },
  {
    id: "wp7",
    clientId: "7", // David Kim
    name: "Athletic Performance Training",
    description: "Sport-specific training for improved agility and performance",
    exercises: [
      {
        id: "e37",
        name: "Box Jumps",
        sets: 4,
        reps: "8",
        weight: "",
        duration: "",
        notes: "Land softly, step down",
      },
      {
        id: "e38",
        name: "Lateral Lunges",
        sets: 3,
        reps: "10 each side",
        weight: "25 lbs",
        duration: "",
        notes: "Push off outside leg",
      },
      {
        id: "e39",
        name: "Medicine Ball Slams",
        sets: 3,
        reps: "12",
        weight: "15 lbs",
        duration: "",
        notes: "Full body power",
      },
      {
        id: "e40",
        name: "Agility Ladder",
        sets: 3,
        reps: "",
        weight: "",
        duration: "30s",
        notes: "Quick feet",
      },
      {
        id: "e41",
        name: "Battle Ropes",
        sets: 3,
        reps: "",
        weight: "",
        duration: "20s",
        notes: "Maximum intensity",
      },
      {
        id: "e42",
        name: "Plyometric Push-ups",
        sets: 3,
        reps: "6-8",
        weight: "",
        duration: "",
        notes: "Explosive movement",
      },
    ],
    createdDate: "2024-02-14",
    isActive: true,
  },
  {
    id: "wp8",
    clientId: "8", // Rachel Martinez
    name: "Beginner Weight Loss",
    description:
      "Gentle introduction to fitness focusing on sustainable weight loss",
    exercises: [
      {
        id: "e43",
        name: "Walking in Place",
        sets: 1,
        reps: "",
        weight: "",
        duration: "5 min",
        notes: "Warm up",
      },
      {
        id: "e44",
        name: "Chair Squats",
        sets: 2,
        reps: "8-10",
        weight: "",
        duration: "",
        notes: "Sit and stand",
      },
      {
        id: "e45",
        name: "Wall Push-ups",
        sets: 2,
        reps: "5-8",
        weight: "",
        duration: "",
        notes: "Start with easier variation",
      },
      {
        id: "e46",
        name: "Seated Marching",
        sets: 2,
        reps: "20",
        weight: "",
        duration: "",
        notes: "Lift knees alternately",
      },
      {
        id: "e47",
        name: "Arm Raises",
        sets: 2,
        reps: "10",
        weight: "2 lbs",
        duration: "",
        notes: "Light weights",
      },
      {
        id: "e48",
        name: "Gentle Stretching",
        sets: 1,
        reps: "",
        weight: "",
        duration: "5 min",
        notes: "Cool down",
      },
    ],
    createdDate: new Date().toISOString().split("T")[0],
    isActive: true,
  },
];

// Centralized mock data for the application
export const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    dateJoined: "2024-01-15",
    fitnessLevel: "intermediate",
    goals: "Weight loss and strength building",
    notes:
      "Prefers morning sessions. Has knee issues - avoid high impact exercises.",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 234-5678",
    dateJoined: "2024-02-03",
    fitnessLevel: "beginner",
    goals: "Build muscle mass and improve endurance",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 345-6789",
    dateJoined: "2024-01-28",
    fitnessLevel: "advanced",
    goals: "Marathon training and performance optimization",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "(555) 456-7890",
    dateJoined: "2024-02-10",
    fitnessLevel: "intermediate",
    goals: "Functional fitness and injury prevention",
  },
  {
    id: "5",
    name: "Alex Thompson",
    email: "alex.thompson@email.com",
    phone: "(555) 567-8901",
    dateJoined: "2025-01-18",
    fitnessLevel: "beginner",
    goals: "General fitness and health improvement",
  },
  {
    id: "6",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@email.com",
    phone: "(555) 678-9012",
    dateJoined: "2025-01-13",
    fitnessLevel: "intermediate",
    goals: "Strength training and flexibility",
  },
  {
    id: "7",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "(555) 890-1234",
    dateJoined: "2024-02-14",
    fitnessLevel: "intermediate",
    goals: "Sports performance and agility training",
  },
  {
    id: "8",
    name: "Rachel Martinez",
    email: "rachel.martinez@email.com",
    phone: "(555) 111-2222",
    dateJoined: new Date().toISOString().split("T")[0], // Today
    fitnessLevel: "beginner",
    goals: "Weight loss and general fitness",
    notes: "New member - very motivated!",
  },
  {
    id: "9",
    name: "Tom Anderson",
    email: "tom.anderson@email.com",
    phone: "(555) 333-4444",
    dateJoined: new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Yesterday
    fitnessLevel: "intermediate",
    goals: "Strength training and muscle building",
  },
  {
    id: "10",
    name: "Sophie Chen",
    email: "sophie.chen@email.com",
    phone: "(555) 555-6666",
    dateJoined: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 2 days ago
    fitnessLevel: "advanced",
    goals: "Powerlifting competition prep",
  },
];

export const mockSessions: Session[] = [
  // Past completed sessions (last 2 weeks)
  {
    id: "1",
    clientId: "1", // Sarah Johnson
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "10:00",
    type: "assessment",
    status: "completed",
    notes: "Initial fitness assessment - knee issues noted",
    cost: 50,
  },
  {
    id: "2",
    clientId: "1",
    date: "2024-01-18",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
    notes: "First workout session - focused on low impact exercises",
    cost: 75,
  },
  {
    id: "3",
    clientId: "2", // Mike Chen
    date: "2024-02-03",
    startTime: "10:30",
    endTime: "11:30",
    type: "assessment",
    status: "completed",
    notes: "Beginner assessment - good baseline strength",
    cost: 50,
  },
  {
    id: "4",
    clientId: "3", // Emily Davis
    date: "2024-01-28",
    startTime: "07:00",
    endTime: "08:00",
    type: "personal-training",
    status: "completed",
    notes: "Marathon training - tempo run and strength work",
    cost: 75,
  },
  {
    id: "5",
    clientId: "1",
    date: "2024-01-22",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
    notes: "Great progress on form, increased weights",
    cost: 75,
  },
  {
    id: "6",
    clientId: "2",
    date: "2024-02-06",
    startTime: "10:30",
    endTime: "11:30",
    type: "personal-training",
    status: "completed",
    notes: "Upper body strength focus - bench press improvement",
    cost: 75,
  },
  {
    id: "7",
    clientId: "4", // James Wilson
    date: "2024-02-10",
    startTime: "15:30",
    endTime: "16:30",
    type: "consultation",
    status: "completed",
    notes: "Discussed functional fitness goals and injury prevention",
    cost: 60,
  },

  // This week's sessions
  {
    id: "8",
    clientId: "1",
    date: "2024-02-12",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "completed",
    notes: "Excellent progress! Lost 6 lbs total, strength improving",
    cost: 75,
  },
  {
    id: "9",
    clientId: "3",
    date: "2024-02-14",
    startTime: "07:00",
    endTime: "08:00",
    type: "personal-training",
    status: "completed",
    notes: "Long run prep - 8 mile pace work, felt strong",
    cost: 75,
  },

  // Today's sessions
  {
    id: "10",
    clientId: "1", // Sarah Johnson
    date: new Date().toISOString().split("T")[0], // Today
    startTime: "08:00",
    endTime: "09:00",
    type: "personal-training",
    status: "completed",
    notes: "Morning session - excellent energy and focus!",
    cost: 75,
  },
  {
    id: "11",
    clientId: "3", // Emily Davis
    date: new Date().toISOString().split("T")[0], // Today
    startTime: "09:30",
    endTime: "10:30",
    type: "personal-training",
    status: "completed",
    notes: "Speed work completed - great progress on intervals",
    cost: 75,
  },
  {
    id: "20",
    clientId: "2", // Mike Chen
    date: new Date().toISOString().split("T")[0], // Today
    startTime: "11:00",
    endTime: "12:00",
    type: "personal-training",
    status: "scheduled",
    notes: "Upper body focus - chest and back",
    cost: 75,
  },
  {
    id: "21",
    clientId: "8", // Rachel Martinez (new client)
    date: new Date().toISOString().split("T")[0], // Today
    startTime: "14:00",
    endTime: "15:00",
    type: "assessment",
    status: "scheduled",
    notes: "Initial fitness assessment for new client",
    cost: 50,
  },
  {
    id: "22",
    clientId: "4", // James Wilson
    date: new Date().toISOString().split("T")[0], // Today
    startTime: "16:00",
    endTime: "17:00",
    type: "personal-training",
    status: "scheduled",
    notes: "Functional movement and core stability",
    cost: 75,
  },

  // Tomorrow and upcoming sessions
  {
    id: "24",
    clientId: "2", // Mike Chen
    date: new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Tomorrow
    startTime: "10:30",
    endTime: "11:30",
    type: "personal-training",
    status: "scheduled",
    notes: "Lower body focus - squats and deadlifts",
    cost: 75,
  },
  {
    id: "25",
    clientId: "1", // Sarah Johnson
    date: "2024-02-16",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "scheduled",
    notes: "Lower body and core strengthening",
    cost: 75,
  },
  {
    id: "13",
    clientId: "3", // Emily Davis
    date: "2024-02-17",
    startTime: "07:00",
    endTime: "08:00",
    type: "personal-training",
    status: "scheduled",
    notes: "Marathon speed work - intervals",
    cost: 75,
  },
  {
    id: "14",
    clientId: "4", // James Wilson
    date: "2024-02-18",
    startTime: "15:30",
    endTime: "16:30",
    type: "personal-training",
    status: "scheduled",
    notes: "Functional movement patterns",
    cost: 75,
  },
  {
    id: "15",
    clientId: "5", // Alex Rodriguez
    date: "2024-02-19",
    startTime: "17:00",
    endTime: "18:00",
    type: "assessment",
    status: "scheduled",
    notes: "Initial fitness assessment",
    cost: 50,
  },

  // Next week's sessions
  {
    id: "16",
    clientId: "1",
    date: "2024-02-22",
    startTime: "09:00",
    endTime: "10:00",
    type: "personal-training",
    status: "scheduled",
    cost: 75,
  },
  {
    id: "17",
    clientId: "2",
    date: "2024-02-22",
    startTime: "10:30",
    endTime: "11:30",
    type: "personal-training",
    status: "scheduled",
    cost: 75,
  },
  {
    id: "18",
    clientId: "1",
    date: "2025-01-20",
    startTime: "10:00",
    endTime: "11:00",
    type: "personal-training",
    status: "cancelled",
    notes: "Client cancelled via portal: Schedule conflict - have to work late",
    cost: 75,
    cancelledBy: "client",
    cancelledAt: "2025-01-17T10:30:00Z",
  },
  {
    id: "19",
    clientId: "2",
    date: "2025-01-21",
    startTime: "14:00",
    endTime: "15:00",
    type: "personal-training",
    status: "cancelled",
    notes: "Trainer cancelled due to illness",
    cost: 75,
    cancelledBy: "trainer",
    cancelledAt: "2025-01-18T09:00:00Z",
  },
];

export const mockPayments: Payment[] = [
  // Completed payments
  {
    id: "1",
    clientId: "1", // Sarah Johnson
    sessionId: "1",
    amount: 50,
    date: "2024-01-15",
    method: "card",
    status: "completed",
    description: "Initial Fitness Assessment",
  },
  {
    id: "2",
    clientId: "1",
    sessionId: "2",
    amount: 75,
    date: "2024-01-18",
    method: "card",
    status: "completed",
    description: "Personal Training Session",
  },
  {
    id: "3",
    clientId: "2", // Mike Chen
    sessionId: "3",
    amount: 50,
    date: "2024-02-03",
    method: "cash",
    status: "completed",
    description: "Initial Assessment",
  },
  {
    id: "4",
    clientId: "3", // Emily Davis
    sessionId: "4",
    amount: 75,
    date: "2024-01-28",
    method: "bank-transfer",
    status: "completed",
    description: "Marathon Training Session",
  },
  {
    id: "5",
    clientId: "1",
    sessionId: "5",
    amount: 75,
    date: "2024-01-22",
    method: "card",
    status: "completed",
    description: "Personal Training Session",
  },
  {
    id: "6",
    clientId: "2",
    sessionId: "6",
    amount: 75,
    date: "2024-02-06",
    method: "cash",
    status: "completed",
    description: "Upper Body Strength Training",
  },
  {
    id: "7",
    clientId: "4", // James Wilson
    sessionId: "7",
    amount: 60,
    date: "2024-02-10",
    method: "venmo",
    status: "completed",
    description: "Functional Fitness Consultation",
  },
  {
    id: "8",
    clientId: "1",
    sessionId: "8",
    amount: 75,
    date: "2024-02-12",
    method: "card",
    status: "completed",
    description: "Personal Training Session",
  },
  {
    id: "9",
    clientId: "3",
    sessionId: "9",
    amount: 75,
    date: "2024-02-14",
    method: "bank-transfer",
    status: "completed",
    description: "Marathon Training Session",
  },

  // Package deals and pending payments
  {
    id: "10",
    clientId: "1",
    amount: 300,
    date: "2024-02-01",
    method: "card",
    status: "completed",
    description: "February Package (4 sessions)",
  },
  {
    id: "11",
    clientId: "2",
    amount: 225,
    date: "2024-02-01",
    method: "bank-transfer",
    status: "completed",
    description: "February Package (3 sessions)",
  },

  // Recent revenue data distributed across last 6 months
  {
    id: "16",
    clientId: "1",
    amount: 300,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Last month
    method: "card",
    status: "completed",
    description: "Monthly Package (4 sessions)",
  },
  {
    id: "17",
    clientId: "2",
    amount: 225,
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 1.5 months ago
    method: "bank-transfer",
    status: "completed",
    description: "3-Session Package",
  },
  {
    id: "18",
    clientId: "3",
    amount: 375,
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 2 months ago
    method: "card",
    status: "completed",
    description: "5-Session Marathon Prep Package",
  },
  {
    id: "19",
    clientId: "4",
    amount: 150,
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 3 months ago
    method: "venmo",
    status: "completed",
    description: "2-Session Package",
  },
  {
    id: "20",
    clientId: "1",
    amount: 450,
    date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 4 months ago
    method: "card",
    status: "completed",
    description: "6-Session Weight Loss Package",
  },
  {
    id: "21",
    clientId: "2",
    amount: 200,
    date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 5 months ago
    method: "cash",
    status: "completed",
    description: "Initial Package Deal",
  },
  {
    id: "22",
    clientId: "3",
    amount: 300,
    date: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 5.5 months ago
    method: "bank-transfer",
    status: "completed",
    description: "Monthly Training Package",
  },

  // This month's revenue
  {
    id: "23",
    clientId: "1",
    sessionId: "10",
    amount: 75,
    date: new Date().toISOString().split("T")[0], // Today
    method: "card",
    status: "completed",
    description: "Morning Personal Training Session",
  },
  {
    id: "24",
    clientId: "3",
    sessionId: "11",
    amount: 75,
    date: new Date().toISOString().split("T")[0], // Today
    method: "bank-transfer",
    status: "completed",
    description: "Marathon Speed Training Session",
  },
  {
    id: "25",
    clientId: "8", // Rachel (new client)
    sessionId: "21",
    amount: 50,
    date: new Date().toISOString().split("T")[0], // Today
    method: "card",
    status: "completed",
    description: "Initial Fitness Assessment",
  },

  // Recent weekly revenue
  {
    id: "26",
    clientId: "2",
    amount: 75,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 2 days ago
    method: "cash",
    status: "completed",
    description: "Personal Training Session",
  },
  {
    id: "27",
    clientId: "4",
    amount: 75,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 3 days ago
    method: "venmo",
    status: "completed",
    description: "Functional Training Session",
  },
  {
    id: "28",
    clientId: "1",
    amount: 75,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 5 days ago
    method: "card",
    status: "completed",
    description: "Personal Training Session",
  },

  // Pending payments (invoices due)
  {
    id: "12",
    clientId: "4",
    amount: 225,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Due next week
    method: "bank-transfer",
    status: "pending",
    description: "Monthly Package (3 sessions)",
  },
  {
    id: "13",
    clientId: "9", // Tom Anderson
    amount: 50,
    date: new Date().toISOString().split("T")[0], // Today
    method: "cash",
    status: "pending",
    description: "Initial Assessment",
  },
  {
    id: "14",
    clientId: "6",
    amount: 150,
    date: "2025-01-13",
    method: "venmo",
    status: "pending",
    description: "Bi-weekly Package (2 sessions)",
  },

  // Failed payment
  {
    id: "15",
    clientId: "7",
    amount: 75,
    date: "2025-01-19",
    method: "card",
    status: "failed",
    description: "Personal Training Session",
  },
];

// Helper function to get client name by ID
export const getClientName = (clientId: string): string => {
  const client = mockClients.find((c) => c.id === clientId);
  return client ? client.name : "Unknown Client";
};
