function logout() {
    first();
    function first() {
        MixinSweet('You are going to logout', "", "info", 2000);
        setTimeout(function () {
            second();
        }, 1000);
    }
    function second() {
        var getaUth = auth.getAuth();
        auth.signOut(getaUth).then(() => {
            // Sign-out successful.
        }).then(function () {
            window.location = 'login';
        })
            .catch(function (error) {
            });
    }
}