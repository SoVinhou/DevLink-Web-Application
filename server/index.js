const express = require("express")
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const bodyParser = require("body-parser")
const cors = require("cors")
const sgMail = require("@sendgrid/mail");

const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
    apiKey: "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",
});


const openAI = new OpenAIApi(config);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(cors())

app.post('/SignUp' , (req,res)=>{
    const email = req.body.email
    
    const msg = ({
        to: {
            email: email,
        },
        from: "sovinhouung7@gmail.com",
        subject: "Thank You For Signing Up!",
        templateId: process.env.TEMPLATE_ID,
        dynamic_template_data: {
            name: email,
        }
    })

    const sendMail = async () => {

        try {
            await sgMail.send(msg);
            console.log("Message Send Successfully!")
        } catch (error) {
            console.error(error);
    
            if (error.response) {
                console.error(error.response.body)
            }
        }
    }

    sendMail();
})


app.post("/PaymentForm", cors(), async (req, res) => {
	let { amount, id } = req.body
	try {
	  const payment = await stripe.paymentIntents.create({
		amount,
		currency: "AUD",
		description: "DevLink MarketPlace",
		payment_method: id,
		confirm: true,
		return_url: "http://localhost:3000/PurchaseCompletion" 
	  })
	  console.log("Payment", payment)
	  res.json({
		message: "Payment successful",
		success: true
	  })
	} catch (error) {
	  console.log("Error", error)
	  res.json({
		message: "Payment failed",
		success: false
	  })
	}
})

app.post("/OpenAI", async (req, res) => {

  try {
    const title = JSON.stringify(req.body.title);
    const gptPrompt = `You are an employer looking to hire ${title}, write a short job description for the ${title} position. You MUST not write more than 100 words`;
    console.log ("\n", gptPrompt)

    const completion = await openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: gptPrompt }],
    })

    console.log(completion.data.choices[0].message.content)
    res.send(completion.data.choices[0].message.content)
  } catch (error) {
    console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
    res.status(500).send("Internal Server Error");
  }

})


app.listen(process.env.PORT || 4000, () => {
	console.log("Sever is listening on port 4000")
})






