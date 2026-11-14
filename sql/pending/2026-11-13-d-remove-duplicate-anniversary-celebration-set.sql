-- The Chinese 1st Anniversary Celebration Set is already listed elsewhere with its picture; remove the picture-less duplicate product tile.
delete from public.product_items where id = 'prod-139-ch';
