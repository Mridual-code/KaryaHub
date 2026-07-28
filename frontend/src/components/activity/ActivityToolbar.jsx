import { FaSearch } from "react-icons/fa";

function ActivityToolbar({

    search,
    setSearch

}) {

    return (

        <div className="toolbar">

            <div className="toolbar-search">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Search activity..."
                    value={search}
                    onChange={(e)=>
                        setSearch(
                            e.target.value
                        )
                    }
                />

            </div>

        </div>

    );

}

export default ActivityToolbar;