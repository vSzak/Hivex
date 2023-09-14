import React, {useState} from 'react'

function registrationForm () {
    return (
        <div className="form-body">
            <div className="firstName">
                <label className="form_label" for="firstName">First Name</label>
                <input className="form_input" type="text" id="firstName" placeholder="First Name"/>            
            </div>
            <div className="lastName">
                <label className="form_label" for="lastName">Last Name</label>
                <input className="form_input" type="text" id="lastName" placeholder="lastName"/>
            </div>
            <div className="email">
                <label className="form_label" for="email">Email</label>
                <input className="form_input" type="email" id="email" placeholder="Email"/>
            </div>
            <div className="password">
                <label className="form_label" for="password">Password </label>
                <input className='form_input' type='password' id='password' placeholder='Password'/>
            </div>
            <div className='confirmPassword'>
                <label className='form_label' for='confirmPassword'>Confirm Password</label>
                <input className='form_input' type='password' id='confirmPassword' placeholder='Confirm Password'/>
            </div>

            <div class="footer">
            <button type="submit" class="btn">Register</button>
            </div>
        </div>
    )
        
}
export default registrationForm