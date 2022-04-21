use zoo;

const id = ObjectId('625d65eb16005b9cc8a2b4bd');
// db.animals.findOne({
//     _id: id
// })

db.animals.updateOne(
    {_id: ObjectId('625d65eb16005b9cc8a2b4bd')},
    {$set: {name:'Miguel'}}
);

db.animals.deleteOne(
    {_id:ObjectId('625d65eb16005b9cc8a2b4bd')}
)