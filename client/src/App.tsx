import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { setUser } from "./store/slices/authSlice";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "@/pages/not-found";
import { RootState } from "./store";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const user = useSelector((state: RootState) => state.auth.user);
  
  if (!user) {
    // Redirect to login if not authenticated
    window.location.href = "/";
    return null;
  }
  
  return <Component />;
}

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email
        }));
      } else {
        dispatch(setUser(null));
      }
    });
    
    return () => unsubscribe();
  }, [dispatch]);
  
  return (
    <TooltipProvider>
      <Toaster />
      
      <Switch>
        <Route path="/" component={user ? Dashboard : Login} />
        <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Add Font Awesome from CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </TooltipProvider>
  );
}

export default App;
