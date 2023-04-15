var addcart = (Id) => {
    $.ajax({
        url: '/addcart?id=' + Id,
        method: 'get',
        success: (response) => {
            if (response.status) {
                var cunt = $('#ct').html()
                cunt = parseInt(cunt) + 1
                $('#ct').html(cunt)
            }
        }
    })
}