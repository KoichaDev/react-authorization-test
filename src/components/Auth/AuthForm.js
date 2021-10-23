import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef('');
  const passwordInputRef = useRef('');

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    // Prevent browser default of a sending request automatically, since we want to send our own requests
    event.preventDefault();
    console.log("submitted");
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;


    setIsLoading(true)

    let url;

    // Optional: Add validation of user input to make sure the email is a valid email and password which is at least 7 characters long
    if(isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDSpDt8AsbkNg4tozrlQgzGeGL2rPt2V8s'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDSpDt8AsbkNg4tozrlQgzGeGL2rPt2V8s';
    }

    // More information how firebase works https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
    fetch(url, {
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
      setIsLoading(false)
      if (res.ok) {
        return res.json()
      } else {
        // throw some errors and give us extra information here
        return res.json().then(data => {
          // show an error modal or anything like that for example, but this is just a very simple demostration app 
          let errorMessage = "Authentication failed!"

          // This is alternative way you could do it
          // if(data && data.error && data.error.message) {
          //   errorMessage = data.error.message;
          // }
          throw new Error(errorMessage)
        })
       
      }
    })
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        alert(err.message)
      });;
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
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading &&  <p>Sending request...</p>}
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
