use zoo;
db.dropDatabase();

db.animals.insertMany([
    {
        name: "Jon",
        type: "Penguin",
        age: 5
    },
    {
        name: "Fiora",
        type: "Polar Bear",
        age: 5
    }
]);