import {

    useState

} from "react";

function ChangePasswordCard({

    onChangePassword

}) {

    const [

        currentPassword,

        setCurrentPassword

    ] = useState("");

    const [

        newPassword,

        setNewPassword

    ] = useState("");

    return (

        <div className="dashboard-card">

            <h3>

                Change Password

            </h3>

            <input

                type="password"

                placeholder="Current Password"

                className="form-control"

                value={currentPassword}

                onChange={(e)=>

                    setCurrentPassword(

                        e.target.value

                    )

                }

            />

            <input

                type="password"

                placeholder="New Password"

                className="form-control"

                value={newPassword}

                onChange={(e)=>

                    setNewPassword(

                        e.target.value

                    )

                }

            />

            <button

                className="primary-btn"

                onClick={()=>{

                    onChangePassword({

                        currentPassword,

                        newPassword

                    });

                }}

            >

                Update Password

            </button>

        </div>

    );

}

export default ChangePasswordCard;