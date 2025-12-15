import { groq } from "next-sanity";

export const heroSlidesQuery = groq`
*[_type=="siteSettings"][0]{
  heroSlides[]->{
    badge,title,copy,ctaLabel,ctaUrl,
    "image":image{..., "url":asset->url}
  }
}
`;

export const allHeroSlidesQuery = groq`
*[_type=="heroSlide"]|order(order asc)[0...5]{
  badge,title,copy,ctaLabel,ctaUrl,
  "image":image{..., "url":asset->url}
}
`;

export const featuredProductQuery = groq`
*[_type=="siteSettings"][0]{
  featuredProduct->{
    _id,
    name,
    "slug": slug.current,
    priceHuf,
    brand,
    shortDescription,
    specs{
      processor,
      memory,
      gpu,
      display,
      refreshRate,
      storage,
      os,
      lan,
      wifi,
      bluetooth,
      hdmi,
      usb2,
      usb3,
      usb31,
      typec,
      optical,
      keyboard,
      audio,
      webcam,
      battery,
      extras,
      moreExtras,
      size,
      weight,
      warranty
    },
    "images": images[]{ "url": asset->url, alt },
    // Kedvezmény számítás
    "discounts": *[_type=="discount" && active == true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now()) && references(^._id)]|order(amount desc){
      type,
      amount
    },
    "discountHufs": discounts[]{
      "d": select(
        type == "percent" => round(^.priceHuf * amount / 100),
        type == "fixed" => amount,
        0
      )
    }.d,
    "discountHuf": coalesce(discountHufs[0], 0),
    "compareAtHuf": priceHuf,
    "finalPriceHuf": priceHuf - coalesce(discountHufs[0], 0),
    "invalidDiscount": (priceHuf - coalesce(discountHufs[0], 0)) < 0
  }
}
`;

export const productsByCategoryQuery = groq`
*[_type=="product" && (
  $category=="" ||
  (defined(categories) && count((categories[])[lower(@)==lower($category)])>0) ||
  (!defined(categories) && category==$category)
 ) && (
  $q=="" ||
  lower(name) match lower($q) ||
  lower(shortDescription) match lower($q) ||
  lower(brand) match lower($q) ||
  lower(specs.processor) match lower($q) || lower(specs.processor) match lower($qNoSpace) ||
  lower(specs.memory) match lower($q) || lower(specs.memory) match lower($qNoSpace) ||
  lower(specs.gpu) match lower($q) || lower(specs.gpu) match lower($qNoSpace) ||
  lower(specs.display) match lower($q) || lower(specs.display) match lower($qNoSpace) ||
  lower(specs.storage) match lower($q) || lower(specs.storage) match lower($qNoSpace)
 ) && (
  !defined(stock) || stock > 0
)]{
  _id,
  name,
  "slug": slug.current,
  priceHuf,
  brand,
  stock,
  shortDescription,
  categories,
  specs{
    processor,
    memory,
    gpu,
    display,
    refreshRate,
    storage,
    os,
    lan,
    wifi,
    bluetooth,
    hdmi,
    usb2,
    usb3,
    usb31,
    typec,
    optical,
    keyboard,
    audio,
    webcam,
    battery,
    extras,
    moreExtras,
    size,
    weight,
    warranty
  },
  "images": images[]{ "url": asset->url, alt },
  // Kedvezmény számítás
  "discounts": *[_type=="discount" && active == true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now()) && references(^._id)]|order(amount desc){
    type,
    amount
  },
  "discountHufs": discounts[]{
    "d": select(
      type == "percent" => round(^.priceHuf * amount / 100),
      type == "fixed" => amount,
      0
    )
  }.d,
  "discountHuf": coalesce(discountHufs[0], 0),
  "compareAtHuf": priceHuf,
  "finalPriceHuf": priceHuf - coalesce(discountHufs[0], 0),
  "invalidDiscount": (priceHuf - coalesce(discountHufs[0], 0)) < 0
}|order(createdAt desc)[0...$limit]
`;

export const blogPostsQuery = groq`
*[_type=="blogPost"]|order(publishedAt desc)[0...$limit]{
  _id,
  title,
  seoTitle,
  seoDescription,
  "slug": slug.current,
  excerpt,
  "image": image{ ..., "url": asset->url },
  tags
}
`;

export const blogPostBySlugQuery = groq`
*[_type=="blogPost" && slug.current==$slug][0]{
  _id,
  title,
  seoTitle,
  seoDescription,
  "slug": slug.current,
  excerpt,
  content,
  "image": image{ ..., "url": asset->url },
  tags,
  publishedAt
}
`;

export const productBySlugQuery = groq`
*[_type=="product" && slug.current==$slug][0]{
  _id,
  name,
  "slug": slug.current,
  priceHuf,
  brand,
  condition,
  shortDescription,
  description,
  categories,
  condition,
  allowMemoryUpgrades,
  memoryUpgradeGroup,
  allowSsdUpgrades,
  stock,
  tags,
  specs{
    processor,
    memory,
    gpu,
    display,
    refreshRate,
    storage,
    os,
    lan,
    wifi,
    bluetooth,
    hdmi,
    usb2,
    usb3,
    usb31,
    typec,
    optical,
    keyboard,
    audio,
    webcam,
    battery,
    extras,
    moreExtras,
    size,
    weight,
    warranty
  },
  "images": images[]{ "url": asset->url, alt },
  // Kedvezmény számítás
  "discounts": *[_type=="discount" && active == true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now()) && references(^._id)]{
    type,
    amount
  },
  "discountHufs": discounts[]{
    "d": select(
      type == "percent" => round(^.priceHuf * amount / 100),
      type == "fixed" => amount,
      0
    )
  }.d,
  "discountHuf": coalesce(discountHufs[0], 0),
  "compareAtHuf": priceHuf,
  "finalPriceHuf": priceHuf - coalesce(discountHufs[0], 0),
  "invalidDiscount": (priceHuf - coalesce(discountHufs[0], 0)) < 0
}
`;

export const catalogItemBySlugQuery = groq`
*[_type in ["product","pc","phone"] && slug.current==$slug][0]{
  _id,
  _type,
  name,
  "slug": slug.current,
  priceHuf,
  brand,
  shortDescription,
  description,
  categories,
  category,
  stock,
  "images": images[]{ "url": asset->url, alt },
  // Kedvezmény számítás
  "discounts": *[_type=="discount" && active == true && (!defined(startsAt) || startsAt <= now()) && (!defined(endsAt) || endsAt >= now()) && references(^._id)]|order(amount desc){
    type,
    amount
  },
  "discountHufs": discounts[]{
    "d": select(
      type == "percent" => round(^.priceHuf * amount / 100),
      type == "fixed" => amount,
      0
    )
  }.d,
  "discountHuf": coalesce(discountHufs[0], 0),
  "compareAtHuf": priceHuf,
  "finalPriceHuf": priceHuf - coalesce(discountHufs[0], 0),
  "invalidDiscount": (priceHuf - coalesce(discountHufs[0], 0)) < 0
}
`;

export const userByEmailQuery = groq`
*[_type=="user" && lower(email)==lower($email)][0]{
  _id,
  email,
  name,
  passwordHash,
  provider,
  image,
  resetTokenHash,
  resetTokenExp
}
`;

export const userAddressesQuery = groq`
*[_type=="user" && lower(email)==lower($email)][0]{
  _id,
  addresses[]{
    _key,
    label,
    fullName,
    phone,
    country,
    zip,
    city,
    addressLine,
    isDefault
  }
}
`;
