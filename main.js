var app = new Vue({
    el: '#app',
    data: {
        errorMsg: "",
        successMsg: "",
        readModal: false,
        editModal: false,
        deleteModal: false,
        users: [],
        newUser: { name: "", email: "", phone: "" },
        currentUser: {}
    },
    mounted: function () {
        this.getAllUsers();
    },
    methods: {

        validEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        validate(name, email, phone) {
            //console.log(name+" "+email+" "+phone);
            if (name === "" || email === "" || phone === "") return false;
            if(!app.validEmail(email)) return false;
            else return true;
        },

        addDataIfValid(type) {

            if (type === "insert") {
                
                var isValidate = app.validate(app.newUser.name, app.newUser.email, app.newUser.phone);
                if (isValidate) {
                    app.readModal = false;
                    app.addUser();
                    app.clearMessage();
                }
            }
            else if (type === "update") {
                var isValidate2 = app.validate(app.currentUser.name, app.currentUser.email, app.currentUser.phone);
                if (isValidate2) {
                    app.editModal = false;
                    app.updateUser();
                    app.clearMessage()
                }
                
            }

        },


        //read data
        getAllUsers() {
            
            axios.get("http://localhost/vue-crud-app/crud.php?action=read")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMsg = response.data.message;
                    }
                    else {
                        app.users = response.data.users;
                    }
                });
        },
        //insert data
        addUser() {

            //console.log("function called");

            var formData = app.toFormData(app.newUser);

            axios.post("http://localhost/vue-crud-app/crud.php?action=create", formData)
                .then(function (response) {
                    app.newUser = { name: "", email: "", phone: "" };
                    if (response.data.error) {
                        app.errorMsg = response.data.message;
                    }
                    else {
                        app.successMsg = response.data.message;
                        app.getAllUsers();
                    }
                });

        },
        toFormData(obj) {
            var fd = new FormData();
            for (var key in obj) {
                fd.append(key, obj[key]);
            }
            return fd;
        },

        //update data
        updateUser() {

            var formData = app.toFormData(app.currentUser);

            axios.post("http://localhost/vue-crud-app/crud.php?action=update", formData)
                .then(function (response) {
                    app.currentUser = {};
                    if (response.data.error) {
                        app.errorMsg = response.data.message;
                        app.getAllUsers();
                    }
                    else {
                        app.successMsg = response.data.message;
                        app.getAllUsers();
                    }
                });

        },

        selectUser(user) {
            app.currentUser = user;
        },

        //delete user
        deleteUser() {

            var formData = app.toFormData(app.currentUser);

            axios.post("http://localhost/vue-crud-app/crud.php?action=delete", formData)
                .then(function (response) {
                    app.currentUser = {};
                    if (response.data.error) {
                        app.errorMsg = response.data.message;
                    }
                    else {
                        app.successMsg = response.data.message;
                        app.getAllUsers();
                    }
                });

        },

        clearMessage() {
            app.errorMsg = "";
            app.successMsg = "";
        }

    }
});