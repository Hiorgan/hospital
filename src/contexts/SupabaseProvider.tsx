import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext } from "react";

const client = createClient(
    "https://vinvzxvuvdwcolorugno.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbnZ6eHZ1dmR3Y29sb3J1Z25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTIwNDMsImV4cCI6MjA0OTM2ODA0M30.6zT8C5fwirgdT2IOBVWHawPjkDwrEWdfn4tLCFu0VsA",
);

export const SupabaseContext = createContext<SupabaseClient>(client);

const SupabaseProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <SupabaseContext.Provider value={client}>
            {children}
        </SupabaseContext.Provider>
    );
};

export const useSupabase = () => useContext(SupabaseContext);

export default SupabaseProvider;
