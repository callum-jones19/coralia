use glob::glob;

/// Recursively scan through a folder and all of its subfolders, returning
/// a list of every single non-directory file encountered
pub fn get_file_paths_in_dir(root_dir: &str) -> Vec<String> {
    let path = String::from(root_dir) + "/**/*";

    let pattern = match glob(&path) {
        Ok(paths) => paths,
        Err(_) => return vec![],
    };

    let mut res: Vec<String> = Vec::new();

    for entry in pattern {
        match entry {
            Ok(path_buf) => {
                if path_buf.is_file() {
                    let tmp = String::from(path_buf.to_str().unwrap());
                    res.push(tmp);
                }
            }
            Err(_) => return vec![],
        }
    }
    return res;
}
