/* eslint-disable no-console */
import { app } from './express/app'

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`)
})
