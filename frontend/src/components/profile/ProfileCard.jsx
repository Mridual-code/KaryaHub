function ProfileCard({

    profile

}) {

    return (

        <div className="dashboard-card">

            <h3>
                Profile Information
            </h3>

            <p>
                <strong>Name :</strong>{" "}
                {profile?.name}
            </p>

            <p>
                <strong>Email :</strong>{" "}
                {profile?.email}
            </p>

            <p>
                <strong>Role :</strong>{" "}
                {profile?.role}
            </p>

        </div>

    );

}

export default ProfileCard;