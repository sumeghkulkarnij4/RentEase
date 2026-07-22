import React, { useState } from "react";

function ChatBot() {

const [messages,setMessages]=
useState([]);

const [input,setInput]=
useState("");

const sendMessage=()=>{

let reply="";

if(input.includes("rent"))

reply="You can rent products monthly.";

else if(input.includes("delivery"))

reply="Delivery takes 2-3 days.";

else if(input.includes("cancel"))

reply="Orders can be cancelled before dispatch.";

else

reply="Please contact customer support.";

setMessages([
...messages,

{
sender:"You",
text:input
},

{
sender:"Bot",
text:reply
}

]);

setInput("");

};

return(

<div className="chatbot">

<h3>RentEase Assistant</h3>

<div className="chat-window">

{messages.map((msg,index)=>(

<div key={index}>

<b>{msg.sender}:</b>

{msg.text}

</div>

))}

</div>

<input

value={input}

onChange={(e)=>
setInput(e.target.value)
}

/>

<button onClick={sendMessage}>

Send

</button>

</div>

);

}

export default ChatBot;