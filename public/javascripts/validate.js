$(document).ready(() => {
  $("#order").validate({
    rules: {
      ph: {
        required: true,
        minlength: 10,
        maxlength : 10,
      },
      pin:
      {
        required: true,
        minlength: 6,
        maxlength : 6,
      }
    }
  });
  // Add a custom validation method for the name field
$.validator.addMethod("startsWithLetter", function(value, element) {
  return this.optional(element) || /^[A-Za-z]/.test(value);
}, "Name must start with a letter.");

// Initialize the validation for your form
$("#usersignupform").validate({
  rules: {
    name: {
      required: true,
      startsWithLetter: true, // Use the custom validation method
    },
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
    },
  }
});
  $("#shopsignupform").validate({
    rules:
    {
      sname:
      {
        required:true,
        startsWithLetter: true
      },
      semail:{
        required:true,
        email:true
      },
      spassword:
      {
        required:true
      }
    }
  })
});
