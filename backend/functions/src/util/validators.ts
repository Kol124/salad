const isEmail = (email: string) => {
  const regEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string: string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

interface signupData {
  email: string;
  password: string;
  handle: string;
  confirmPassword: string;
}
interface loginData {
  email: string;
  password: string;
}
interface error {
  email?: string;
  password?: string;
  handle?: string;
  confirmPassword?: string;
}

const validateSignupData = (data: signupData) => {
  let errors: error = {};
  if (isEmpty(data.email)) {
    errors.email = "Email is must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Password must match";
  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const validateLoginData = (data: loginData) => {
  let errors: error = {};
  if (isEmpty(data.email)) errors.email = "Email is must not be empty";
  if (isEmpty(data.password)) errors.password = "PASSWORD is must not be empty";
  console.error("this is expected", errors);

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const reduceUserDetails = (data: any) => {
  let userDetails = {} as any;

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http")
      userDetails.website = `https://${data.website.trim()}`;
  } else userDetails.website = data.website;
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

export { validateLoginData, validateSignupData, reduceUserDetails };
