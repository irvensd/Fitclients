export const sampleClients = [
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 123-4567",
    goals: "Lose 15 pounds and build core strength",
    fitnessLevel: "intermediate",
    preferredDays: ["Monday", "Wednesday", "Friday"],
    preferredTime: "morning",
    joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
  },
  {
    name: "Michael Chen",
    email: "m.chen@example.com", 
    phone: "(555) 234-5678",
    goals: "Build muscle mass and improve overall fitness",
    fitnessLevel: "advanced",
    preferredDays: ["Tuesday", "Thursday", "Saturday"],
    preferredTime: "evening",
    joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
  },
  {
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "(555) 345-6789",
    goals: "Marathon training and endurance improvement",
    fitnessLevel: "advanced",
    preferredDays: ["Monday", "Wednesday", "Friday", "Sunday"],
    preferredTime: "morning",
    joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
  },
  {
    name: "David Thompson",
    email: "d.thompson@example.com",
    phone: "(555) 456-7890",
    goals: "Post-injury rehabilitation and strength recovery",
    fitnessLevel: "beginner",
    preferredDays: ["Tuesday", "Thursday"],
    preferredTime: "afternoon",
    joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    name: "Jessica Park",
    email: "j.park@example.com",
    phone: "(555) 567-8901",
    goals: "Improve flexibility and reduce back pain",
    fitnessLevel: "intermediate", 
    preferredDays: ["Monday", "Thursday", "Saturday"],
    preferredTime: "morning",
    joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
  }
];

export const generateSampleCSV = () => {
  const headers = ["name", "email", "phone", "goals"];
  const rows = sampleClients.map(client => [
    client.name,
    client.email,
    client.phone,
    client.goals
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  return csvContent;
}; 