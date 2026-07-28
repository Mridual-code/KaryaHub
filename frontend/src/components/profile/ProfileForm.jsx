import {
    useState
} from "react";

function ProfileForm({

    profile,

    onSave

}) {

    const [name,setName] =
        useState(profile?.name || "");

    return (

        <div className="dashboard-card">

            <h3>

                Edit Profile

            </h3>

            <input

                className="form-control"

                value={name}

                onChange={(e)=>

                    setName(
                        e.target.value
                    )

                }

            />

            <button

                className="primary-btn"

                onClick={()=>{

                    onSave({

                        name

                    });

                }}

            >

                Save Changes

            </button>

        </div>

    );

}

export default ProfileForm;