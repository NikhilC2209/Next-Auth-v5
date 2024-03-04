import { auth } from '@/auth';
import Logout from '@/components/Logout';


export default async function DashBoard() {

	const session = await auth();

	console.log(session);

	return (
		<>
		  <h1>Dashboard Page</h1>
		  <span>Welcome {session.user.name}</span>
		  <div>
		  	<Logout />
		  </div>
		</>
	)
}