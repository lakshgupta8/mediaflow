-- Create a table for user profiles
-- This links directly to the Supabase Auth system
create table profiles (
    id uuid references auth.users not null primary key,
    name text,
    avatar_url text
);
-- Note: Enable RLS (Row Level Security)
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for
select using (true);
create policy "Users can insert their own profile." on profiles for
insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for
update using (auth.uid() = id);
-- Create a table for watchlists
create table watchlists (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles not null,
    media_id int not null,
    -- The TMDB ID
    media_type text not null check (media_type in ('movie', 'tv')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, media_id, media_type)
);
alter table watchlists enable row level security;
create policy "Users can view own watchlists." on watchlists for
select using (auth.uid() = user_id);
create policy "Users can insert own watchlists." on watchlists for
insert with check (auth.uid() = user_id);
create policy "Users can delete own watchlists." on watchlists for delete using (auth.uid() = user_id);
-- Create a table for favorites
create table favorites (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles not null,
    media_id int not null,
    -- The TMDB ID
    media_type text not null check (media_type in ('movie', 'tv')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, media_id, media_type)
);
alter table favorites enable row level security;
create policy "Users can view own favorites." on favorites for
select using (auth.uid() = user_id);
create policy "Users can insert own favorites." on favorites for
insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites." on favorites for delete using (auth.uid() = user_id);
-- Create a trigger to automatically create a profile when a new user signs up
create function public.handle_new_user() returns trigger as $$ begin
insert into public.profiles (id, name)
values (new.id, new.raw_user_meta_data->>'name');
return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();