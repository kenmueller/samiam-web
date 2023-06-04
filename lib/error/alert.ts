import { toast } from 'react-toastify'

const alertError = (error: Error) => {
	toast.error(error.message)
	console.error(error)
}

export default alertError
