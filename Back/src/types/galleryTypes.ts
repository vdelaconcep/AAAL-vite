export type NewEventData = {
    eventName: string,
    date: string,
    photos: { url: string, publicId: string }[],
    description?: string
}

export type NewEventDataBody = {
    eventName: string,
    date: string,
    description?: string
}

export type UpdateEventDataBody = {
    eventName?: string,
    date?: string,
    description?: string
}

export type Event = {
    id: string;
    event_name: string;
    date: string;
    description: string;
    created_at: string;
    modified_at: string;
}

export type Photo = {
    id: string;
    url: string;
    description: string;
    order: number;
    created_at: string;
    modified_at: string;
    cloudinary_public_id: string;
}

interface EventWithPhotos extends Event {
    photos: Photo[];
    success: true;
}

interface EventNotFound {
    success: false;
    message: string;
}

export type GetEventByIdResult = EventWithPhotos | EventNotFound;
