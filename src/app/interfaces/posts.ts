import { IUser } from "./user";

export interface IPost {
    id?: number;
    title?: string;
    body?: string;
    music_preview?: string;
    source_url?: string | null;
    thumbnail?: string;
    slug?: string;
    owner_id: number;
    owner_username: string;
    metadata?: any;
    status?: string;
    parent_id?: number | null;
    type_stage?: string | null | undefined;
    likes?: any;
    children?: IPost[];
    user?: Partial<IUser>,
    tags?: any,
    created_at?: string;
    updated_at?: string;

}