use std::{fs::create_dir_all, path::PathBuf};

pub fn program_cache_dir() -> Option<PathBuf> {
    let mut base_cache_dir = dirs::cache_dir()?;
    base_cache_dir.push("coralia");
    create_dir_all(&base_cache_dir).unwrap();

    Some(base_cache_dir)
}
