export interface IUser{
    id?: number;
    displayName: string | null;
    email: string;
    social_links?: string;
    permission?: string;
    photoURL?: string | null;
    metadata?: string | null | undefined; 
    created_at?: string;
    updated_at?: string;
}