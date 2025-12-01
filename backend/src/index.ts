import { server } from "./app";
import { appConfig } from "./utils/config";

const PORT = appConfig.port || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
