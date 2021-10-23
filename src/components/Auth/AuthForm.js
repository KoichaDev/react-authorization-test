import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef('');
  const passwordInputRef = useRef('');

  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    // Prevent browser default of a sending request automatically, since we want to send our own requests
    event.preventDefault();
    console.log("submitted");
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Optional: Add validation of user input to make sure the email is a valid email and password which is at least 7 characters long
    if(isLogin) {

    } else {
      // More information how firebase works https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDSpDt8AsbkNg4tozrlQgzGeGL2rPt2V8s', {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          // This is to let the Auth REST API knows that we are going to send some JSON data coming in here
          'Content-type': 'application/json'
        },
      }).then((res) => {
        if(res.ok) {
          // ...
        } else {
          // throw some errors and give us extra information here
          return res.json().then(data => {
            // show an error modal or anything like that
            console.log(data)
          });
        }
      });
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
