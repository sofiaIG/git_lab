import {useState} from "react";
import { postSighting } from "./SightingService";

const SightingsForm = ({addSighting}) => {
    
    const [formData, setFormData] = useState({})

    const onChange = (e) =>{
        formData[e.target.id] = e.target.value;
        setFormData(formData);
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        postSighting(formData).then((data)=>{
            addSighting(data);
        })
    }

    return (
        <form onSubmit={onSubmit} id="sightings-form" >
            <h2>Add a Sighting</h2>
            <div className="formWrap">
                <label htmlFor="species">Species:</label>
                <input onChange={onChange} type="text" id="species"  />
            </div>
            <div className="formWrap">
                <label htmlFor="location">Location:</label>
                <input onChange={onChange} type="text" id="location"  />
            </div>
            <div className="formWrap">
                <label htmlFor="date">Date:</label>
                <input onChange={onChange} type="date" id="date"  />
            </div>

            <input type="submit" value="Save" id="save"/>
	    </form>

    );
}

export default SightingsForm;