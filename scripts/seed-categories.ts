import { database } from "@/database";
import { categories } from "@/database/schema";
const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

async function main() {
  console.log("Seeding Categories ...");

  try {
    const values = categoryNames.map((name) => ({
      name: name,
      description: `Videos related to ${name.toLowerCase()}`,
    }));

    await database.insert(categories).values(values);

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories: ", error);
    process.exit(1);
  }
}

main();
