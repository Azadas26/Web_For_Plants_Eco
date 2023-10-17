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
});
