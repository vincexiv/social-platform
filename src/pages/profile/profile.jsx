import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProfileInfo from "../../components/profile-info/profile-info";
import apiHost from "../../utilities/api";
import { useGet } from "../../utilities/hooks";
import { useState } from "react";
import "./profile.css"
import { useEffect } from "react";

function Profile(){
    const location = useLocation()
    // const [userDetails, setUserDetails] = useState([])
    let userDetails = location.pathname === '/profile' ? useSelector(state => state.user.userDetails) : []

    // If we reached here not by the /profile path, it means we got
    // here by the /users/:id/profile path that is used when we want
    // to view the profile of other users. In this case show the content
    // of those users
    if(location.pathname !== '/profile'){
        const [,,userId] = location.pathname.split("/")
        const details = useGet(`${apiHost}/users/${userId}`)
        userDetails = details
    }

    // userDetails is an object, which is also nested in certain instances.
    // In this function, I convert the nested object into a nested array
    // of the <ProfileInfo /> component, through recursion
    function arrayFyDetails(details){
        const result = []

        for(const key of Object.keys(details)){
            if(typeof(details[key]) === 'string'){
                result.push(
                    <ProfileInfo key={`top-level-profile-${key}`} name={key} value={details[key]}/>
                )
            }else if(typeof(details[key]) === 'object'){
                result.push(
                    <div key={`top-level-profile-${key}`}>
                        <p className="title">{key}</p>
                        <div style={{paddingLeft: '2rem'}}>
                            {
                                arrayFyDetails(details[key])
                            }
                        </div>
                    </div>
                )
            }
        }

        return result;
    }

    return (
        <div id="page-profile" className="page">
            <div className="container">
                <div id="section-profile" className="content">
                    <div className="user-info">{ arrayFyDetails(userDetails) }</div>
                </div>
            </div>
        </div>
    )
}

export default Profile;