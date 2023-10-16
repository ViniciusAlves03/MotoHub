import "dotenv/config"
import { App } from "./app/app"
import { mongoose } from "./app/db/conn";

const PORT = process.env.PORT || 5000;

new App().server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
