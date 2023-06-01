var addcart = (Id,shopeId) => {
    $.ajax({
        url: '/addcart?id=' + Id + '&shopeId='+ shopeId,
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