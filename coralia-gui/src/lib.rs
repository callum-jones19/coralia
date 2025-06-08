use iced::widget::{button, column, container, text};
use iced::{Element, Length};

pub fn start_gui() -> iced::Result {
    iced::run("Coralia", update, view)
}

#[derive(Debug, Clone)]
enum Message {
    Increment,
    Decrement,
}

#[derive(Default, Debug)]
struct RootState {
    counter: u64,
    // username: String,
    // email: String,
}

fn update(root_state: &mut RootState, message: Message) {
    match message {
        Message::Increment => root_state.counter += 1,
        Message::Decrement => {
            if root_state.counter > 0 {
                root_state.counter -= 1
            }
        }
    }
}

///
fn view(root_state: &RootState) -> Element<Message> {}
