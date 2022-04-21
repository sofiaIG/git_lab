import React, {useEffect, useState} from 'react';

function App() {

  const [message, setMessage] = useState(null);

  useEffect(()=>{
    fetch('http://localhost:5000')
    .then(res => res.json())
    .then( data =>setMessage(data.message))
  })
  return (
    <h1>{message}</h1>
  );
}

export default App;