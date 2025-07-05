
import { getServerSession } from 'next-auth';
import { next_auth } from '@/lib/next_auth';
import SignoutButton from '@/ui/SignoutButton';

export default async function Dashboard() {

    const session = await getServerSession(next_auth);

    if(!session){
        return (
            <div>not logged in</div>
        )
    }

    // useEffect(()=>{
    //     if(!user || !token) return ;
    //   async function checkUserExist(){
    //     try {
    //         const res = await axios.get('/api/user/user-exist' , {
    //             headers : {
    //                 Authorization : `Bearer ${token}`
    //             }
    //         })
    //         console.log(res.data)
    //         if(!res.data.exist){
    //             if (user?.uid) {
    //                 const hash = btoa(user.uid);
    //                 console.log(hash);
    //                 router.replace(`/auth/completeprofile?uid=${hash}`)
    //             }
    //         }else{
    //             return;
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    //   }
    //   startTransition(async ()=>{
    //     await checkUserExist();
    //   })
    // },[user])

    //if(pending) return <LoadingIcon/>

    return (
        <div>
            <p>logged in</p>
            <SignoutButton/>
        </div>

      
    )
}