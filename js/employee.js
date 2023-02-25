class Employee{
    #firstName;
    #lastName;
    #address;
    #email;
    #age;
    #userName;
    #password;
    #type;
    constructor(_email,_firstname,_lastname,_address,_age,_username,_password,_type){
        this.Fname=_firstname;
        this.Lname=_lastname;
        this.Address=_address;
        this.Age=_age;
        this.Email=_email;
        this.UserName=_username;
        this.Password=_password;
        this.Type=_type;
    }
    set Email(_email){
        this.#email=_email;
    }
    get Email(){
        return this.#email;
    }
    set Fname(_firstname){
        this.#firstName=_firstname;
    }
    get Fname(){
       return this.#firstName;
    }

    set Lname(_lastname){
        this.#lastName=_lastname
    }
    get Lname(){
        return this.#lastName;
    }
    set Address(_address){
        this.#address=_address;
    }
    get Address(){
        return this.#address;
    }
    set Age(_age){
        this.#age=_age;
    }
    get Age(){
        return this.#age;
    }
    set UserName(_username){
        this.#userName=_username
    }
    get UserName(){
        return this.#userName;
    }
    set Password(_password){
        this.#password=_password;
    }
    get Password(){
        return this.#password;
    }
    set Type(_type){
        this.#type=_type;
    }
    get Type(){
        return this.#type;
    }

    //post data in json
     save(){
        fetch("http://localhost:3000/pending",{method:"POST",
        headers:{
            "Content-type":"application/json; charset=UTF-8"
        },
        body:JSON.stringify({
            email :`${this.#email}`,
            firstName :`${this.#firstName}`,
            lastName :`${this.#lastName}`,
            address :`${this.#address}`,
            age :`${this.#age}`,
            userName:`${this.#userName}`,
            password:`${this.#password}`,
            type:`${this.#type}`
        }),
    })
    }
}
export {Employee}