require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import your models
const User = require("./models/User");
const Professor = require("./models/Professor");

// --- 1. RAW DATA ---

const rawProfessors = [
  { name: "Sumit Vishwakarma", email: "sumitv@iitk.ac.in" },
  { name: "Arun Mehta", email: "arunm@iitk.ac.in" },
  { name: "Priya Sharma", email: "priyas@iitk.ac.in" },
  { name: "David Chen", email: "davidc@iitk.ac.in" },
  { name: "Sarah Johnson", email: "sarahj@iitk.ac.in" }
];

const rawStudents = [
  { email: "likhithal23@iitk.ac.in", username: "devil" },
  { email: "omsingh21@iitk.ac.in", username: "hero" },
  { email: "preetid23@iitk.ac.in", username: "sher" },
  { email: "aayusha23@iitk.ac.in", username: "sawasher" },
  { email: "aayushd23@iitk.ac.in", username: "rehman" },
  { email: "abhirupg23@iitk.ac.in", username: "hamza" },
  { email: "btirlangi23@iitk.ac.in", username: "tiger" },
  { email: "adityakv23@iitk.ac.in", username: "lion" },
  { email: "adityamane23@iitk.ac.in", username: "notfound" },
  { email: "adityapr23@iitk.ac.in", username: "dhurandhar" },
  { email: "aswaaiitp23@iitk.ac.in", username: "angelpriya" },
  { email: "adyansub23@iitk.ac.in", username: "shift" },
  { email: "ahermukund23@iitk.ac.in", username: "swift" },
  { email: "akash23@iitk.ac.in", username: "ferrari" },
  { email: "pratyushks23@iitk.ac.in", username: "lambo" },
  { email: "akshatsh23@iitk.ac.in", username: "maruti" },
  { email: "akshatsing23@iitk.ac.in", username: "yoyo" },
  { email: "ssharma22@iitk.ac.in", username: "badshah" },
  { email: "akulag23@iitk.ac.in", username: "cheeta" },
  { email: "amankumar23@iitk.ac.in", username: "xaiver" },
  { email: "amanmaloo23@iitk.ac.in", username: "liger" },
  { email: "amanu23@iitk.ac.in", username: "omini" },
  { email: "ameerzaman23@iitk.ac.in", username: "amex" },
  { email: "ananyaki23@iitk.ac.in", username: "tower" },
  { email: "anirvant23@iitk.ac.in", username: "trexx" },
  { email: "spratyush23@iitk.ac.in", username: "sallu" },
  { email: "anujag23@iitk.ac.in", username: "fox" },
  { email: "anupamap23@iitk.ac.in", username: "shera" }
];

// --- PASSWORD MAP FOR STUDENTS ---
const studentPasswordMap = {
  "likhithal23@iitk.ac.in": "Likhitha123.",
  "omsingh21@iitk.ac.in": "Om123.",
  "preetid23@iitk.ac.in": "Preeti123.",
  "aayusha23@iitk.ac.in": "Aayusha123.",
  "aayushd23@iitk.ac.in": "Aayushd123.",
  "abhirupg23@iitk.ac.in": "Abhirup123.",
  "btirlangi23@iitk.ac.in": "Badrinath123.",
  "adityakv23@iitk.ac.in": "Adityak123.",
  "adityamane23@iitk.ac.in": "Adityam123.",
  "adityapr23@iitk.ac.in": "Adityap123.",
  "aswaaiitp23@iitk.ac.in": "Adwaaiit123.",
  "adyansub23@iitk.ac.in": "Adyansu123.",
  "ahermukund23@iitk.ac.in": "Mukund123.",
  "akash23@iitk.ac.in": "Akash123.",
  "pratyushks23@iitk.ac.in": "Pratyush123.",
  "akshatsh23@iitk.ac.in": "Akshatsh123.",
  "akshatsing23@iitk.ac.in": "Akshatsi123.",
  "ssharma22@iitk.ac.in": "Sudhanshu123.",
  "akulag23@iitk.ac.in": "Akul123.",
  "amankumar23@iitk.ac.in": "Amank123.",
  "amanmaloo23@iitk.ac.in": "Amanm123.",
  "amanu23@iitk.ac.in": "Amanu123.",
  "ameerzaman23@iitk.ac.in": "Ameer123.",
  "ananyaki23@iitk.ac.in": "Ananya123.",
  "anirvant23@iitk.ac.in": "Anirvan123.",
  "spratyush23@iitk.ac.in": "Spratyushs123.",
  "anujag23@iitk.ac.in": "Anuj123.",
  "anupamap23@iitk.ac.in": "Anupama123."
};

// --- HELPER FUNCTIONS ---

const generatePasswordFromName = (fullName) => {
  const firstName = fullName.split(" ")[0].toLowerCase();
  return firstName.charAt(0).toUpperCase() + firstName.slice(1) + "123.";
};

async function seedDatabase() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB!");

    const allUsers = [
      ...rawProfessors.map((p, i) => ({
        email: p.email,
        name: p.name,
        role: "Professor",
        username: `prof_${i}`
      })),
      ...rawStudents.map((s) => ({
        email: s.email,
        username: s.username,
        role: "Student"
      }))
    ];

    console.log(`⏳ Hashing passwords for ${allUsers.length} users...`);

    const usersToInsert = await Promise.all(
      allUsers.map(async (user) => {
        let plainPassword;

        if (user.role === "Professor") {
          plainPassword = generatePasswordFromName(user.name);
        } else {
          plainPassword = studentPasswordMap[user.email];

          if (!plainPassword) {
            throw new Error(`No password found for ${user.email}`);
          }
        }

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        return {
          email: user.email,
          username: user.username,
          role: user.role,
          password: hashedPassword,
          isVerified: true
        };
      })
    );

    // Clear old data
    console.log("⏳ Clearing old seed data...");
    const emails = usersToInsert.map((u) => u.email);

    await User.deleteMany({ email: { $in: emails } });
    await Professor.deleteMany({
      email: { $in: rawProfessors.map((p) => p.email) }
    });

    // Insert new data
    console.log("⏳ Inserting Users and Professor Whitelist...");

    await User.insertMany(usersToInsert);

    await Professor.insertMany(
      rawProfessors.map((p) => ({
        email: p.email,
        name: p.name
      }))
    );

    console.log("\n🎉 Database Seeded Successfully! 🎉\n");
    console.log("=========================================");
    console.log("🔑 SAMPLE LOGINS:");

    console.log("Professor:");
    console.log(`sumitv@iitk.ac.in  →  Sumit123.`);

    console.log("Student:");
    console.log(`omsingh21@iitk.ac.in  →  Om123.`);

    console.log("=========================================\n");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}

seedDatabase();