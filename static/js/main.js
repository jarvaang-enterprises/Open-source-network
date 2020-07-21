$('#msform').on('submit', e => {
    e.preventDefault()
    const email = btoa(e.target[0].value)
    const passwd = btoa(e.target[1].value)
    const msform = document.getElementById("msform")
    var form = new FormData(msform)
    console.log("Email: "+email)
    console.log("Password: "+passwd)
    $.ajax({
        type: "POST",
        method: 'post',
        url: "/login?email="+email+"&password="+passwd,
        data: {
            email: email,
            password: passwd
        },
        cache: false,
        success: function (data) {
            console.log(data)
        },
        error: function () {
            alert("Errors occured: In authentication.")
        }
    });
})