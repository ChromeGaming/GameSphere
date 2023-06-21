const emailRegex =
  /^\w+([\.-]?\w+)*@(gmail\.com|yahoo\.com|hotmail\.com|aol\.com|outlook\.com)$/;

const validate = {
  name: (value) => {
      return value.length < 6 ? true : false;
  },
  email: (value) => {
    return emailRegex.test(value) ? false : true;
  },

  subject: (value)=>{
    const words = value.split(" ").length;
     return (words<2 || words>6)? true: false;
  },
  message: (value)=>{
    const words = value.split(" ").length;
    return (words<10 || words>100)? true: false;
  },
};

function handleChange(event){
    const name = event.target.name;
    const value = event.target.value;

 const isError =  validate[name](value);
 if(isError){
    document.getElementById(`${name}Error`).classList.remove("hidden");
 }else{
    document.getElementById(`${name}Error`).classList.add("hidden");
 }
}

function handleSubmitClick(){
    const errors = [...document.getElementsByClassName("error")];
    errors.forEach(elem=>{
        if(!elem.classList.contains("hidden")){
            alert("Please Enter Valid Values");
            return;
        }
    })
}
